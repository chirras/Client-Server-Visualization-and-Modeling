


function displayData() {

	var scale = document.getElementById("Scalers");
	var scalerType = scale.options[scale.selectedIndex].text;
	var valueC = document.getElementById("valueOfC").value;
	//document.getElementById("par").innerHTML = "http://127.0.0.1:5000/"+scalerType+"/"+valueC;

	var url = "http://127.0.0.1:5000/"+scalerType+"/"+valueC;

	var margin = { top: 20, right: 20, bottom: 50, left: 50 };
	var width = 520 - margin.left - margin.right;
    var height = 520 - margin.top - margin.bottom;

	var svg = d3.select("body")
	  .append("svg")
	  .attr("width", width)
	  .attr("height", height);

	var xScale = d3.scaleLinear()
	  .domain([0,1])
	  .range([margin.left, width-margin.right]);

	var yScale = d3.scaleLinear()
	  .domain([0,1])
	  .range([height-margin.bottom, margin.top]);


	var xAxis = svg.append("g")
	  .attr("transform", `translate(0, ${height-margin.bottom})`)
	  .call(d3.axisBottom().scale(xScale));

	var yAxis = svg.append("g")
	  .attr("transform", `translate(${margin.left},0)`)
	  .call(d3.axisLeft().scale(yScale));

	svg.append("text")
        .attr("text-anchor", "middle")  
        .attr("transform", "translate("+ (margin.left/3) +","+(height/2)+")rotate(-90)")  
        .text("TruePositiveRate");

    svg.append("text")
        .attr("text-anchor", "middle")  
        .attr("transform", "translate("+ (width/2) +","+(height-margin.bottom/5)+")")  
        .text("FalsePositiveRate");       

	svg.append("text")
     	.attr("transform", "translate("+ (width/2) + "," +((margin.top))+")")
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text("ROC Curve");

	d3.json(url, function(error, data) {
		if (error) return console.warn(error);
		//var rocData = JSON.parse(JSON.stringify(data));
	    console.log(data);

	    var line = d3.line()
					.x(function(d) { return xScale(d.fpr); })
					.y(function(d) { return yScale(d.tpr); });


	    var path = svg.append("path")
				      .datum(data)
			    		.attr("d", line)
			    		.attr("fill", "none")
						.attr("stroke", "steelblue")
						.attr("stroke-linejoin", "round")
						.attr("stroke-linecap", "round")
						.attr("stroke-width", 2.5); 
		path.enter()
			.append("path")
		      .attr("fill", "none")
		      .attr("d", line)
		      .each(function(d) {this._current = d;} );

		path.exit().remove()

	});

}


