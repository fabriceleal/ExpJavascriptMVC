{
	"tag": "div",
	"merge_with_container" : true,
	"inner" : [
		"Data arrived asynchronously!!!",
		function(user){ return user.name; },
		{
			"tag"  : "a",
			"href" : function(user){ return user.url; },
			"inner": function(user){ return user.url; },
		}
	]
}