{
	"draw" : function(chart_node, chart_data){
		var data = new google.visualization.DataTable();

		chart_data.columns.forEach(function(item){
			data.addColumn(item[0], item[1]);
		});

		data.addRows(chart_data.data);

        var options = {'title':chart_node.title,
                       'width':800,
                       'height':300,
					   'halign' : 'center'};

        var chart = new google.visualization.PieChart($('#'+chart_node.user_div_id)[0]);
        chart.draw(data, options);
	}
}