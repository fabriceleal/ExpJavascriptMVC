{
	"tag"   : "div",
	"inner" :[
		"Fixed text",
		"This is a defered view, generated as data arrive.",
		{
			"tag" : "div",
			"inner" : function(ids){
				// Generate view-holders
				return ids.map(function(id){ 
					return {
						"tag"   : "div",
						"id"    : "user_view_" + id,
						"inner" : id,

						"defered" : true,
						"object_id" : id
					};
				});
			}
		}
	]
}