{
	"behaviour"	: 	"fusion",

	"inner" : 	function(chart, ctx) {
					console.log('expanding ...');
	
					// Complement
					chart.user_div_id = ctx.user_div_id;
	
					// Load and exec draw function
					(function(obj){

						getDataEntity(obj.data.table, obj.data.id, function(chart_data){
							console.log('loaded chart data!');
							getDataEntity(obj.draw.table, obj.draw.id, function(chart_draw){
								console.log('loaded chart draw!');
								
								console.log(chart_data);
								console.log(chart_draw);
								
								chart_draw.draw(obj, chart_data);
							});							
						});

					})( chart );

					return "Just a little more ...";
				}
}