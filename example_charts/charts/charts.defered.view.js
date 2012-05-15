{
	"tag" 	: 	"div",

	"inner" : 	function(charts){
					return charts.map(	function(item){
											return {
												"tag" : "div",
												"id"  : "chart_div_" + item,
												"inner" : "Wait a while ;) ...",

												/*,"defered" : true,
												"object_id" : item*/
												
												// User data
												"user_chart_here" : true,
												"user_ctx" : {
													"id" : item
												}
											};
										});
				},

	"compilation_afterAppend" : function(node){
		//console.log('after append');
		
		// Create script tag to load google APIs
		var googleScript = document.createElement('script');
		googleScript.id = 'googleAPI';
		// Append to head
		($('head')[0]).appendChild(googleScript);
		
		//console.log(node);
		
		googleScript.onload = 
				function(){					
					//console.log('loaded script');

					var onLoaded = function(){						
						$(function(){
							// Signal something to someone :|													
							//console.log("$(google.load)!");
						});
					};
					var onLoadedDummy = function(){};
					
					/*dummy, without callback my html gets all broken! >:( */
					google.load('visualization', '1.0', {'packages':['corechart'], 'callback' : onLoadedDummy/*onLoaded*/});
					google.setOnLoadCallback(function (){
												$(function(){
													// Signal something to someone :|													
													//console.log("$(google.setOnLoadCallback)!");
													
													// Generate and compile ctx for every child
													node.inner.filter(function(n){return n.user_chart_here}).forEach(function(child){
														var ctx = {
															data	: "charts/" + child.user_ctx.id + ".json",
															view	: "charts/charts.arrived.view.js",
															parent	: $('#' + child.id)[0],
															
															// Complement
															user_div_id : 'chart_div_' + child.user_ctx.id
														};
														console.log('compile for ' + ctx.data);
														
														cleanCompile(ctx);
													});
												});
											}, true /*Without this, this wont get called >:( */ );
					//---
				};
		//---

		// Set type [I don't want any trouble :( ] and src (lets get ready to rumble!)
		googleScript.type = "text/javascript";
		googleScript.src = "https://www.google.com/jsapi";

		return true;
	}
	
}