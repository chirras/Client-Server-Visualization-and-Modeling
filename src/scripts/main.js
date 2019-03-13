


function displayData() {

	var scale = document.getElementById("Scalers");
	var scalerType = scale.options[scale.selectedIndex].text;
	var valueC = document.getElementById("valueOfC").value;
	//document.getElementById("par").innerHTML = "http://127.0.0.1:5000/"+scalerType+"/"+valueC;

	var url = "http://127.0.0.1:5000/"+scalerType+"/"+valueC;

	var margin = { top: 20, right: 20, bottom: 30, left: 50 };
	var width = 520 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

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


	d3.json(url, function(error, data) {
		if (error) return console.warn(error);
		var rocData = JSON.parse(data);
	    console.log(rocData.TruePositive['1']);

		var plotData = [
			{ fpr: rocData.FalsePositive['0'], tpr: rocData.TruePositive['0'] },
			{ fpr: rocData.FalsePositive['1'], tpr: rocData.TruePositive['1'] },
			{ fpr: rocData.FalsePositive['2'], tpr: rocData.TruePositive['2'] }
		];
		console.log(plotData)

	    var circle = svg.selectAll("circle") 
	                .data(plotData)
	                .enter()
	                .append("circle")
	                  .attr("cx", function(d) { return xScale(d.fpr); })
	                  .attr("cy", function(d) { return yScale(d.tpr); })
	                  .attr("r", 5)
	                  .attr("fill", "steelblue");

	    var line = d3.line()
					.x(function(d) { return xScale(d.fpr); })
					.y(function(d) { return yScale(d.tpr); });
					//.curve(d3.curveMonotoneX);

	    var path = svg.append("path")
				      .datum(plotData)
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


