{
	"tag": 'div',
	"inner":[
		'This is a view for a post',
		{
			"tag" : "div",
			"inner" : function(post){ return post.id; }
		},
		{
			"tag": "div",
			"inner" : function(post){ return post.title; }
		}
	]
}