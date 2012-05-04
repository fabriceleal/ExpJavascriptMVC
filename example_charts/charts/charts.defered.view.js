{
	"tag" 	: 	"div",

	"inner" : 	function(charts){
					return charts.map(	function(item){
											return {
												"tag" : "div",
												"id"  : "chart_div_" + item,
												"inner" : "Wait a while ;) ..."

												/*,"defered" : true,
												"object_id" : item*/
											};
										});
				},

	"compilation_afterAppend" : function(node){
		var t = function(){return new Date();};
	
		console.log(t().toISOString() +'begin compilation_afterAppend');
		
		// Load google APIs
		var googleScript = document.createElement('script');
		($('head')[0]).appendChild(googleScript);

		googleScript.onload = 
				function(){
					console.log(t().toISOString() + "begin onload callback");

					var tryme = function(){
						console.log('callback for try-me!');
					};
					
					google.load('visualization', '1.0', {'packages':['corechart'], 'callback' : tryme/**/});
					google.setOnLoadCallback(function (){
												console.log(t().toISOString() + "google.setOnLoadCallback!");
												
												$('#chart_div_1').innerText = 'Hello!';
												
												$(function(){
													// Signal something to someone :|
													console.log(t().toISOString() + "$(google.setOnLoadCallback)!");
												});											
											}, true);
					//---
					/*google.load('visualization', '1.0', {'packages':['corechart']});*/
					
					console.log(t().toISOString() +'end onload callback');
				};
		//---

		googleScript.type = "text/javascript";
		googleScript.src = "https://www.google.com/jsapi";
		console.log(t().toISOString() +'end compilation_afterAppend');

		//googleScript.innerText = "(function(){ console.log('hello'); })()"

		return true;
	}
	
}