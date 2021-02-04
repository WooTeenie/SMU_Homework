// global
var chosen_xaxis = "age";

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

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);


        // STEP 3: PREPARE THE DATA
        data.forEach(function(row) {
            row.age = +row.age;
            row.smokes = +row.smokes;
            row.poverty = +row.poverty;
        });

        // STEP 4: Create the Scales
        var xScale = createXScale(data, chart_width);

        var yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.smokes))
            .range([chart_height, 0]);


        // STEP 5: CREATE THE AXES
        var leftAxis = d3.axisLeft(yScale);
        var bottomAxis = d3.axisBottom(xScale);

        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // // STEP 5.5: Create the Text
        // var textVal = chart.append("g")
        //     .selectAll("text")
        //     .data(data)
        //     .enter()
        //     .append("text")
        //     .text(d => d.abbr)
        //     .attr("alignment-baseline", "central")
        //     .attr("font-size", 12)
        //     .classed("stateText", true);

        // STEP 6: CREATE THE GRAPH
        // append circles
        var circlesGroup = chartGroup.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("stroke-width", "1")
            .style("opacity", 0.25)
            .classed("stateCircle", true)

        // STEP 6.5: Be extra. Have the circles fly
        chartGroup.selectAll("circle")
            .attr("cx", d => xScale(d[chosen_xaxis]))
            .attr("cy", d => yScale(d.smokes))
            .attr("r", "15")
            .style("opacity", 0.25)

        chartGroup.selectAll(".stateText")
            .attr("x", d => xScale(d[chosen_xaxis]))
            .attr("y", d => yScale(d.smokes))


        // STEP 7: TOOLTIP
        circlesGroup = createTooltip(circlesGroup);

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (chart_height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Smokes (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 30})`)
            .attr("class", "axisText active")
            .attr("id", "age")
            .text("Age (Median)")
            .style("cursor", "pointer")
            .on("click", function() {
                chosen_xaxis = "age";

                // update the x scale
                xScale = createXScale(data, chart_width);

                //update the x axis
                bottomAxis = d3.axisBottom(xScale);
                xAxis = createXAxis(xAxis, bottomAxis);

                // update the circles
                circlesGroup = updateCircles(circlesGroup, xScale);
                circlesGroup = createTooltip(circlesGroup);

                d3.select(this).classed("inactive", false);
                d3.select(this).classed("active", true);

                d3.select("#poverty").classed("active", false);
                d3.select("#poverty").classed("inactive", true);
            });

        //Add another text blob
        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 50})`)
            .attr("class", "axisText inactive")
            .attr("id", "poverty")
            .text("Poverty")
            .style("cursor", "pointer")
            .on("click", function() {
                chosen_xaxis = "poverty";

                // update the x scale
                xScale = createXScale(data, chart_width);

                //update the x axis
                bottomAxis = d3.axisBottom(xScale);
                xAxis = createXAxis(xAxis, bottomAxis);

                // update the circles
                circlesGroup = updateCircles(circlesGroup, xScale);
                circlesGroup = createTooltip(circlesGroup);

                d3.select(this).classed("inactive", false);
                d3.select(this).classed("active", true);

                d3.select("#age").classed("active", false);
                d3.select("#age").classed("inactive", true);
            });


    }).catch(function(error) {
        console.log(error);
    });
}

function createXScale(data, chart_width) {
    var xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[chosen_xaxis]))
        .range([0, chart_width]);

    return xScale;
}

function createXAxis(xAxis, bottomAxis) {
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function updateCircles(circlesGroup, xScale) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xScale(d[chosen_xaxis]));

    return circlesGroup;
}

function createTooltip(circlesGroup) {
    //step 0, get label
    var label = "";
    if (chosen_xaxis == "age") {
        label = "Age"
    } else {
        label = "Poverty";
    }

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`<strong>${d.state}<strong><hr><strong>${label}: ${d[chosen_xaxis]}, Smokers (%): ${d.smokes}</strong>`);
        });

    // Step 2: Create the tooltip in chartGroup.
    circlesGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(event, d) {
            toolTip.show(d, this);

            //make bubbles big
            d3.select(this)
                .transition()
                .duration(1000)
                .attr("r", 100);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(event, d) {
            toolTip.hide(d);

            d3.select(this)
                .transition()
                .duration(1000)
                .attr("r", 10);
        });

    return circlesGroup; // this is important
}