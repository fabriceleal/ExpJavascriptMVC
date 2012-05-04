{
	"tag" 	: 	"div",

	"inner" : 	function(charts){
					return charts.map(	function(item){
											return {
												"tag" : "div",
												"id"  : "chart_div_" + item,
												"inner" : "Wait a while ;) ...",

												"defered" : true,
												"object_id" : item
											};
										});
				},

	"compilation_afterAppend" : function(node){
		console.log('after compile');
		
		// Load google APIs
		var googleScript = document.createElement('script');
		$('head')[0].appendChild(googleScript);

		googleScript.onload = 
				function(){
					console.log("hello 1!");

					google.load('visualization', '1.0', {'packages':['corechart']});
					google.setOnLoadCallback(function (){
												// Signal something to someone :|
												console.log("hello final!");
											});
					//---
				};
		//---

		googleScript.src = "https://www.google.com/jsapi";
		console.log('hello!');
		
		//googleScript.innerText = "(function(){ console.log('hello'); })()"

		return true;
	}
	
}