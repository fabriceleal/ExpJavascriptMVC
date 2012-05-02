{
	"behaviour"	: 	"fusion",

	"inner" : 	function(chart) {
					// Load and exec draw function
					(function(obj){
						//console.log('draw method')
						//console.log(obj.div_id)
						var node = document.getElementById(obj.div_id);

						if(! node){
							console.log('ups!');
						}

						console.log(node);
						node.innerText = 'Hello ' + obj.div_id;
					})( chart );
					
					return null; // To avoid complications :P
				}
}