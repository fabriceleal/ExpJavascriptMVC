{
	'type' : 'context',

	'data' : 'users/users.defered.json',
	'view' : 'users/users.defered.view.js',

	'defered_root': 'users/',
	'arrived_view': 'users/users.arrived.view.js',
	
	// TODO: A filename, that must be downloaded and compiled on the fly
	// TODO: This should be done at expansion, not compilation!!!!
	
	'defered' : 'users.arrived.ctx.js', 
	
	'parent' : ((function(){ return $('body')[0]})())
}