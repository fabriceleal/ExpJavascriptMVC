// This is intended to be "patchable"
var walking_rules = [
	/*
	{
		cond :   (meta-object)		=> bool
		transf : (meta-object, data)=> compiled-tree
	},
	*/

	{
		cond   : 	function(lbd_meta){ return typeof lbd_meta == "function"; },
		transf : 	function(lbd_meta, lbd_data) {
						var res = lbd_meta(lbd_data);

						// Apply compilation to the result-of-the-function itself 
						// (ie, do not assume that is always a string ...)
						
						// This will handle functions that return functions ;)
						return rec_walking(res, lbd_data);
					}
	},
	{
		cond   : 	function(lbd_meta){ return lbd_meta.constructor == Array; },
		transf : 	function(lbd_meta, lbd_data){
						return lbd_meta.map(function(lbd_elem){
							return rec_walking(lbd_elem, lbd_data);
						});
					}
	},
	{
		cond   : 	function(lbd_meta){ return typeof lbd_meta == "object"; },
		transf : 	function(lbd_meta, lbd_data){
						// Run through all the attributes! Create new object.
						var ret = {};
						for(var att in lbd_meta){
							ret[att] = rec_walking(lbd_meta[att], lbd_data);
						}
						return ret;
					}
	}
];
 
 /* 
 * Compiles a meta-tree into a tree
 * All the functions in the "meta-tree" are executed with data as the single argument.
 * The final "tree" should contain only objects or strings.
 *
 * Synchronous
 */
 var rec_walking = function(meta, data){
	if(meta){
	
		// TODO: Move all this to an exterior file, append to the prototype of Array

		var firstOrNull = walking_rules.filter(
				(function(){
					// Set to false as soon as it finds a matching rule
					var first = true;

					//Return function with closured var first
					return function(rule){
						// If already found one elem, stops testing conds and returns always false
						if(!first) return false;
						
						// If doesn't have a rule yet, test conds; return true as soon as it finds one
						if(rule.cond(meta)){
							first = false;
							return true;
						}
						
						// returns false if all fails
						return false;
					}
				})());
		// ---
		
		firstOrNull = firstOrNull && firstOrNull[0] ? firstOrNull[0] : null;

		if(firstOrNull){
			return firstOrNull.transf(meta, data);
		}
	}
	
	// With the default rules, will reach this point nulls, strings and numbers.

	return meta;
};

/*
 * Compiles a tree into HTML
 * The context will be needed for defered data, 
 * that implies asyncronous compilation.
 *
 * Synchronous. A defered ctx will lead to compilation of the follow-up ctx.
 */
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
					if(typeof tree.inner == "string"){
						// No need to create a <p> tag!
						node.innerText = tree.inner;
					}else{
						// tree.inner it's an arbitrary object
						var toapp = rec_compiling(tree.inner, ctx);
						if(toapp) node.appendChild(toapp);
					}
				}
			}						
			return node;
		}
	}
	
	return null;
};

/*
 * Compiles a context (data and view) into html, inject into body.
 */
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
			callback(data.reduce(ctx.redutor.redutor, ctx.redutor.init));
		};
	}
	
	// Data cached; make a dummy wrapper
	var get_data_wrapper = redutor_data_wrapper;	

	if(typeof ctx.data == "string"){
		// Assume that data is a json url; fetch it!
		get_data_wrapper = function(url, callback){  
			getData(url, function(cmpld){
				redutor_data_wrapper(cmpld, callback);
			});
		}; 
	}
	
	get_data_wrapper(ctx.data, function(data){
		//console.log('I have data!');

		// Load view. Use the same approach.
		if(typeof ctx.view == "string"){
			get_data_wrapper = getData;
		}else{
			get_data_wrapper = function(data, callback){
				callback(data);
			};
		}

		get_data_wrapper(ctx.view, function(meta_tree){
			//console.log('I have meta-tree!');

			// Compile the meta-tree to a tree
			var compiled = rec_walking(meta_tree, data);
			//console.log('Tree ok!');

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
