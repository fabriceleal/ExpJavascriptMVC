{
	"tag": "div",
	"inner": [
		"Fixed Text",
		function(posts, ctx){ 
			return "This is a view for all posts, there are " + posts.length + " posts"; 
		},
		{
			"tag" : "div",
			"inner": function(posts, ctx){
				return [
					"Table",
					{
						"tag" : "div",
						"inner":[
							{ 
								"tag" : "div",
								"inner": "id"
							},
							{
								"tag": "div",
								"inner": "title"
							}
						]
					}
				].concat(
					posts.map(function(item, idx, arr){
						return {
							"tag" : "div",
							"inner":[
								{
									"tag": "div",
									"inner": item.id
								},
								{
									"tag": "div",
									"inner": item.title
								},
								{
									"tag" : "a",
									"inner" : "Click to view details",
									/*"onclick" : function(){
										context2.data = item;
										compile(context2);
									},*/
									"href" : ctx.url.full_no_pars + "?post_id=" + item.id
								}
							]
						};
					})
				)
			}
		}
	]
}