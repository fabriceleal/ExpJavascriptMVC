
/**
 * Decomposes an url into its parts: protocol, directory, resource, parameters
 */
function decompose(url){
	var part1 = url.match("(https?)://(.*)/(.*\.html)?\\??(.*)?");
	
	if(!part1){
		return {};
	}
	
	var pars = null;
	
	while(part1[4]){
		var t = part1[4].match("(.*?)=(.*)[&#]");

		if(!t)
			t = part1[4].match("(.*?)=(.*)");

		if(!t)
			break;

		if(!pars)
			pars = {};

		pars[t[1]] = t[2];
			
		part1[4] = part1[4].substr(t[0].length);
	}
	
	return {
		full 	: url,
		protocol: part1[1],
		dir		: part1[2],
		resource: part1[3],
		resource_parts : splitExtension(part1[3]),
		full_no_pars : part1[1] + '://' + part1[2] + '/' + part1[3],
		pars : pars
	};
}

/**
 * Split a filename into a name and an extension. If
 * the file as a name such as name.and.something.ext, the name
 * will be assumed to be "name.and.something", and 
 * the extension only "ext"
 */
function splitExtension(someString){
	var tmp = someString.match("^(.*)\\\.(.*)$");
	if(tmp){
		return {
			name : tmp[1],
			ext  : tmp[2]
		};
	}	
	return {
		name : someString,
		ext  : null
	};
}