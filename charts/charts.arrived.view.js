{
	"behaviour"	: 	"fusion",

	"inner" : 	function(chart) {

					// Load draw function
					draw = function(obj){
						document.getElementById(chart.div_id).innerText = 'Hello ' + chart.div_id;
					};
					//...

					// Run draw function
					draw(chart);

					return null; // To avoid complications :P
				}
}