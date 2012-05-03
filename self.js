
$(document).ready(function(){

	// Download context with the same name as the page
	var parts = decompose(document.URL);
	//console.log(parts);

	getData(parts.resource_parts.name + '.ctx.js', function(ctx){
		//console.log('Ctx downloaded and compiled!');
		
		// Complement ctx
		ctx.url = parts;

		// Compile
		compileWithContainer(ctx, ctx.parent);
	});
});