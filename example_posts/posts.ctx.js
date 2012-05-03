(function(){
	// Returns the right context, which depends on the current URL
	
	var decomposition = decompose(document.URL);
	
	if(decomposition.pars){	
		// Context for a single post
		return {
			'type' : 'context',
			
			'data' : 'posts.json' ,
			'view' : 'post.view.js',
			
			'redutor' : {
				'init' : null,
				'redutor' : function(res, item){
								if(item.id == decomposition.pars.post_id){ 
									return item; 
								} 
								return res; 
							}
			},
			
			'parent' : ((function(){ return $('body')[0]; })())
		};
	}
	
	// Context for a list of posts
	return {
		'type' : 'context',
		
		'data' : 'posts.json',
		'view' : 'posts.view.js',

		'parent' : ((function(){ return $('body')[0]; })())
	};
	
})()