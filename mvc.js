// Little Helper for AJAX
function get_data(url, callback){
	var req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.onreadystatechange = function(state){
		if(req.readyState != 4) return;
		
		callback(req.responseText);
	};
	req.send(null);
}


// Compiles Meta-tree into Tree
var rec_walking = function(meta, data){
	if(meta){
	
		if(typeof meta == "function"){
			return meta(data);
		}

		if(meta.constructor == Array){
			return meta.map(function(elem){
				return rec_walking(elem, data);
			});
		}
		
		if(typeof meta == "object"){
			return ({
				tag   : meta.tag,
				inner : rec_walking(meta.inner, data)
			});
		}
	}

	return meta;
};


// Compiles tree into HTML
var rec_compiling = function (tree, ctx){
	if(tree){
		if(typeof tree != "object"){
			
			// For strings, numbers, create a p and put the content inside :P
			var node = document.createElement('p');
			node.innerText = tree;
			return node;
			
		}else if(tree.tag){
					
			var node = document.createElement(tree.tag);
			
			if(tree.id){
				node.id = tree.id;
			}
			
			if(tree.tag == 'a'){
				if(tree.onclick) node.onclick = tree.onclick;
				if(tree.href) node.href = tree.href; 
			}
			
			if(tree.defered){
				// This node will need to load data and to compile itself
				// Create a new context for loading this node.
				// TODO: ...
				var localContext = {
					data : ctx.defered_root + tree.object_id + '.json',
					view : ctx.arrived_view,
					id : 'nanana'
				};
				
				cleanCompileWithContainer(localContext, node);
			}
			
			if(tree.inner){
				if(tree.inner.constructor == Array){
					tree.inner.forEach(function(item){
						var toapp = rec_compiling(item, ctx);
						if(toapp) node.appendChild(toapp);
					});
				}
				else
				{
					var toapp = rec_compiling(tree.inner, ctx);
					if(toapp) node.appendChild(toapp);
				}
			}						
			return node;
		}
	}
	
	return null;
};

// Compiles a context (data and view) into html, inject into body
var cleanCompileWithContainer = function(ctx, container){
	if(!ctx){
		console.error('compile error: no ctx');
		return false;
	}
	
	if(ctx.data == null){
		console.error('compile error: no data in ctx');
		return false;
	}

	

	// Dummy wrapper, no reduce
	var redutor_data_wrapper = function(data, callback){ 
		callback(data); 
	};	
	if(ctx.redutor){
		// Wrapper with reduce
		redutor_data_wrapper = function(data, callback){
			callback(data.reduce(
								ctx.redutor.redutor,
								ctx.redutor.init));
		};
	}
	
	// Data cached; make a dummy wrapper
	var get_data_wrapper = function(data, callback){
		redutor_data_wrapper(data, callback);
	};	
	if(typeof ctx.data == "string"){
		// Assume that data is a json url; fetch it!
		// use get_data, normally
		get_data_wrapper = function(url, callback){  
			get_data(url, function(raw){
				(function(data){

					redutor_data_wrapper(data, callback);

				})(JSON.parse(raw));				
			});
		}; 
	}
	
	get_data_wrapper(ctx.data, function(data){
		console.log('I have data!');

		// Load view. Use the same approach.
		if(typeof ctx.view == "string"){
			get_data_wrapper = function(url, callback){
				get_data(url, function(raw){
					// Compile the view to a meta-tree
					raw = eval('(function(){ return (' + raw +');})()');
					callback(raw);
				});
			};
		}else{
			get_data_wrapper = function(data, callback){
				callback(data);
			};
		}

		get_data_wrapper(ctx.view, function(meta_tree){
			console.log('I have meta-tree!');

			// Compile the meta-tree to a tree
			compiled = rec_walking(meta_tree, data);
			console.log('Tree ok!');

			// Compile tree to html, and inject in container			
			while(container.childNodes.length > 0){
				container.removeChild(container.childNodes[0]);
			}
			container.appendChild(rec_compiling(compiled, ctx));	
		});

	})
}

var cleanCompile = function(ctx){
	cleanCompileWithContainer(ctx, document.getElementById('body'));
}

var compileWithContainer = function(ctx, container){
	cleanCompileWithContainer(ctx, container);
	//history.pushState(ctx, "", "#");
}

var compile = function(ctx){
	compileWithContainer(ctx, document.getElementById('body'));
}
