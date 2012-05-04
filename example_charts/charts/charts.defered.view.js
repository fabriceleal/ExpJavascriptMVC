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
		console.log('after append');
		
		// Load google APIs
		var googleScript = document.createElement('script');
		($('head')[0]).appendChild(googleScript);

		googleScript.onload = 
				function(){
					console.log('loaded script');
				
					var onLoaded = function(){
						/*dummy, without this my html gets all broken! >:( */
						$(function(){
							// Signal something to someone :|													
							console.log("$(google.load)!");
							
							//$('#chart_div_1').innerText = 'Hello!';
						});
					};
					var dummy = function(){};
					
					google.load('visualization', '1.0', {'packages':['corechart'], 'callback' : dummy/*onLoaded*/});
					google.setOnLoadCallback(function (){
												$(function(){
													// Signal something to someone :|													
													console.log("$(google.setOnLoadCallback)!");
													
													$('#chart_div_1').innerText = 'Hello!';
												});											
											}, true /*Without this, this wont get called >:( */ );
					//---

				};
		//---

		googleScript.type = "text/javascript";
		googleScript.src = "https://www.google.com/jsapi";

		return true;
	}
	
}