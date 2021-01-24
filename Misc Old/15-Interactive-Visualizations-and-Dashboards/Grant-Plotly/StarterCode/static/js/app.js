var g_data = [];

$(document).ready(function() {
    perform();

    $('#selDataset').change(function() {
        doWork();
    });
});

function perform() {
    d3.json("samples.json").then((data) => {
        g_data = data;

        makeFilters(data);
        doWork();
    });
}

function doWork() {
    var sample = parseInt($("#selDataset").val());
    var metadata = g_data.metadata.filter(x => x.id === sample)[0];
    var sample_data = g_data.samples.filter(x => x.id == sample)[0];

    makeDemo(metadata);
    makePlots(sample_data, metadata);
}

function makePlots(sample_data, metadata) {
    $('#plots').show();
    makeBar(sample_data);
    makeBubble(sample_data);
    makeGauge(metadata);
}

function makeFilters(data) {
    data.names.forEach(function(val) {
        var newOption = `<option>${val}</option>`;
        $('#selDataset').append(newOption);
    });
}

function makeDemo(metadata) {
    //refresh the data each time updated
    $("#sample-metadata").empty();

    // Update the data in the Demo Panel
    Object.entries(metadata).forEach(function(key_value, index) {
        var entry = `<span><b>${key_value[0]}:</b> ${key_value[1]}</span><br>`;
        $("#sample-metadata").append(entry);
    });
}

function makeBar(sample_data) {
    var y_labels = sample_data.otu_ids.slice(0, 10).reverse().map(x => `OTU ID ${x}`);
    var trace = {
        x: sample_data.sample_values.slice(0, 10).reverse(),
        y: y_labels,
        text: sample_data.otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: "h",
        marker: {
            color: 'rgba(255,153,51,0.6)',
            width: 1
        }
    };

    var layout = {
        title: "Top 10 Bacteria Types in Subject's Belly Button",
        xaxis: { title: "Amount of Bacteria" },
    }

    var traces = [trace];

    Plotly.newPlot('bar', traces, layout);
}

function makeBubble(sample_data) {
    var trace = {
        x: sample_data.otu_ids,
        y: sample_data.sample_values,
        mode: 'markers',
        marker: {
            size: sample_data.sample_values,
            color: sample_data.otu_ids
        },
        text: sample_data.otu_labels
    };

    var traces = [trace];

    var layout = {
        title: { text: "Amount of Bacteria by Type in Subject's Belly Button", font: { size: 32 } },
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Amount of Bacteria" }
    }

    Plotly.newPlot('bubble', traces, layout);
}

function makeGauge(metadata) {
    var max_wfreq = 10;

    var trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: metadata.wfreq,
        title: { text: "Belly Button Washing Frequency", font: { size: 32 } },
        type: "indicator",
        gauge: {
            axis: { range: [null, max_wfreq] },
            steps: [
                { range: [0, 7], color: "lightgray" },
                { range: [7, 10], color: "gray" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 2
            }
        },
        mode: "gauge+number+delta"
    };
    var traces = [trace];
    var layout = {
        font: { color: "Black", family: "Arial" }
    }
    Plotly.newPlot('gauge', traces, layout);
}