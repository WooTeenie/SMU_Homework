$(document).ready(function() {
    makePlot();

    //event listener
    $(window).resize(function() {
        makePlot();
    });
});

function makePlot() {
    d3.csv("assets/data/data.csv").then(function(data) {
        console.log(data);

        // STEP 1: SET UP THE CANVAS
        $("#scatter").empty();

        // var svgWidth = 960;
        var svgWidth = window.innerWidth;
        var svgHeight = 500;

        var margin = {
            top: 20,
            right: 40,
            bottom: 60,
            left: 50
        };

        var chart_width = svgWidth - margin.left - margin.right;
        var chart_height = svgHeight - margin.top - margin.bottom;

        // STEP 2: CREATE THE SVG (if it doesn't exist already)
        // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .classed("chart", true);

        var chart = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // STEP 3: PREPARE THE DATA
        data.forEach(function(row) {
            row.age = +row.age;
            row.smokes = +row.smokes;
        });

        // STEP 4: Create the Scales
        var xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.age))
            .range([0, chart_width]);

        var yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.smokes))
            .range([chart_height, 0]);

        // STEP 5: CREATE THE AXES
        var leftAxis = d3.axisLeft(yScale);
        var bottomAxis = d3.axisBottom(xScale);

        chart.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottomAxis);

        chart.append("g")
            .call(leftAxis);

        // STEP 5.5: Create the Text
        var textVal = chart.append("g")
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("alignment-baseline", "central")
            .attr("font-size", 12)
            .classed("stateText", true);

        // STEP 6: CREATE THE GRAPH
        // append circles
        var circles = chart.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .style("opacity", 0.25)
            .attr("stroke-width", "1")
            .classed("stateCircle", true)


        // STEP 6.5: Be extra. Have the circles fly
        chart.selectAll("circle")
            // .transition()
            // .duration(5000)
            .attr("cx", d => xScale(d.age))
            .attr("cy", d => yScale(d.smokes))
            .attr("r", "15")
            .style("opacity", 0.25)
            // .delay(function(d, i) { return i * 100 });

        chart.selectAll(".stateText")
            // .transition()
            // .duration(5000)
            .attr("x", d => xScale(d.age))
            .attr("y", d => yScale(d.smokes))
            // .delay(function(d, i) { return i * 100 });


        // STEP 7: Add Axes Labels
        // Create axes labels
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 0)
            .attr("x", 0 - (chart_height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Smokes (%)");

        chart.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Age (Median)");

        // STEP 8: TOOLTIP
        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([180, -60])
            .html(function(d) {
                return (`<strong>${d.state}<strong><hr><strong>Median Age: ${d.age}</strong><hr><strong>Percentage of Smokers: ${d.smokes}%</strong>`);
            });

        // Step 2: Create the tooltip in chartGroup.
        circles.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circles.on("mouseover", function(event, d) {
                toolTip.show(d, this);

                //make bubbles big
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 50);
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(event, d) {
                toolTip.hide(d);

                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 15);
            });

    }).catch(function(error) {
        console.log(error);
    });
}