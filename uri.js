

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
		protocol: part1[1],
		dir		: part1[2],
		resource: part1[3],
		pars : pars
	};
}