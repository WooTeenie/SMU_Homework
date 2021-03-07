var g_data = [];

$(document).ready(function() {
    perform();

    $('#selDataset').change(function() {
        work();
    });
});

function perform() {
    d3.json("samples.json").then((data) => {
        g_data = data;
        console.log(g_data);

        work();
    });
}

function work() {
    var subject = parseInt($("#selDataset").val());
    var metadata = g_data.metadata.filter(x => x.id === subject)[0];
    var sample_values = g_data.samples.filter(x => x.id == subject)[0];

    makeDemo(metadata);
    makePlots(sample_values, metadata);
}

function makePlots(sample_values, metadata) {
    $('#plots').show();
    makeBar(sample_values);
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