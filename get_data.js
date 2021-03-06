/*
	Functions for downloading and compiling data (.js or .json).
*/

/*
 * Downloads from an arbitrary url.
 */
function getDataRaw(url, callback){
	var req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.onreadystatechange = function(state){
		if(req.readyState != 4) return;
		
		if(req.status == 200){
			// Don't callback if message != 200 !!!
			callback(req.responseText);
		}
	};
	try{
		req.send(null);
	}catch (e){
		// Resource not found ... or whatever...
		//throw e; //As for now, do NOT throw errors.
		console.warn(e);
	}	
}

function getMethodByUrl(url){
	if(url.match("^.*\.js$")){
		return "js";
	}
	if(url.match("^.*\.json$")){
		return "json";
	}
	
	return false;
}

/*
 * Downloads data identified as a tuple table (directory) and id (filename).
 */
function getDataEntityRaw(table, id, callback){
	// Build url. As for now, assume that all data directories are at the root.
	var url = table + "/" + id;
	
	var called = false;
	
	// How to see if its .json or .js ??? Try both :-| ...	
	// Only allow one to be successfull though!
	
	var js = url + ".js", json = url + ".json";
	
	getDataRaw(js, function(data){
		if(called){
			console.warn('Unexpected call for js (' + url +').');
			return;
		}else{
			called = true;
		}
		
		callback(data, js);
	});

	getDataRaw(json, function(data){
		if(called){
			console.warn('Unexpected call for json (' + url +').');
			return;
		}else{
			called = true;
		}		

		callback(data, json);
	});
}

/*
 * Downloads from an arbitrary url, and compiles using the extension of the url.
 */ 
function getData(url, callback){
	getDataRaw(url, function(data){
		//console.log('getData: has data!');
		compileData(data, getMethodByUrl(url), function(compiled){
			//console.log('compileData: has compiled data!');
			callback(compiled);
		});
	});
}

/*
 * Downloads data identified as a tuple table (directory) and id (filename), and compiles.
 */
function getDataEntity(table, id, callback){
	getDataEntityRaw(table, id, function(data, url){
		compileData(data, getMethodByUrl(url), function(compiled){
			callback(compiled);
		});
	});
}

function compileData(data, method, callback){
	var compiles = {
		json : function(raw, callback){
			if(!raw){
				throw Error('No data for Json compilation!');
			}

			if(!callback){
				throw Error('No callback for Json compilation!');
			}

			try{
				var compiled = JSON.parse(raw);
			}catch(e){
				throw Error('Error compiling Json data ('+ data +'): ' + e);
			}

			// "Return" whatever was compiled.
			//console.log(compiled);
			
			callback(compiled);			
		},
		js : function(raw, callback){
			if(!raw){
				throw Error('No data for Js compilation!');
			}

			if(!callback){
				throw Error('No callback for Js compilation!');
			}
			
			var compiled = null;
			try{
				 compiled = eval('(function(){ return (' + raw +');})()');
			}catch(e){
				throw Error('Error compiling Js data ('+ data +'): ' + e)
			}
			
			// "Return" whatever was compiled.
			//console.log(compiled);
			
			callback(compiled);
		}
	};

	if (compiles[method]){
		// If compilation is supported, compile and call callback

		compiles[method](data, function(compiled){
			callback(compiled);
		});

	}else{
		throw Error("Unsupported compileData method: " + method);
	}
}


// Small cache class
function Cache(){
	this.cached = {};
}

Cache.prototype.hasEntity = function(table, id){
	return false;
}

Cache.prototype.get = function(table, id){
	return null;
}

Cache.prototype.put = function(table, id, newValue){
	return false;
}

var mCache = new Cache();