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

		// Load google APIs
		var googleScript = document.createElement('script');
		document.getElementsByTagName('head')[0].appendChild(googleScript);

		googleScript.onload = 
				function(){
					console.log("hello 1!");

					google.load('visualization', '1.0', {'packages':['corechart']});
					google.setOnLoadCallback(
							function signalSomething(){
								// Signal something to someone :|
								console.log("hello final!");
							});
					//---
				};
		//---

		googleScript.src = "https://www.google.com/jsapi";
		//googleScript.innerText = "(function(){ console.log('hello'); })()"

		return true;
	}
	
}