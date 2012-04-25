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
var rec_compiling = function (tree){
	if(tree){
		if(typeof tree != "object"){
			
			// For strings, numbers, create a p and put the content inside :P
			var node = document.createElement('p');
			node.innerText = tree;
			return node;
			
		}else if(tree.tag){
					
			var node = document.createElement(tree.tag);
			
			if(tree.tag == 'a'){
				if(tree.onclick) node.onclick = tree.onclick;
				if(tree.href) node.href = tree.href; 
			}
			
			if(tree.inner){
				if(tree.inner.constructor == Array){
					tree.inner.forEach(function(item){
						var toapp = rec_compiling(item);
						if(toapp) node.appendChild(toapp);
					});
				}
				else
				{
					var toapp = rec_compiling(tree.inner);
					if(toapp) node.appendChild(toapp);
				}
			}						
			return node;
		}
	}
	
	return null;
};

// Compiles a context (data and view) into html, inject into body
var compile = function(ctx){
	if(ctx.data == null){
		console.error('compile error: no data in ctx');
		return;
	}
	
	var get_data_wrapper = null;
	
	if(typeof ctx.data == "string"){
		// Assume that data is a json url; fetch it!
		// use get_data, normally
		get_data_wrapper = function(url, callback){  
			get_data(url, function(raw){
				callback(JSON.parse(raw));
			});
		}; 
	}else{
		// Data cached; make a dummy wrapper
		get_data_wrapper = function(data, callback){
			callback(data);
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
			
			// Compile tree to html, and inject in body
			var body = document.getElementById('body');
			while(body.childNodes.length > 0){
				body.removeChild(body.childNodes[0]);
			}
			body.appendChild(rec_compiling(compiled));
		});
		
	})
}
