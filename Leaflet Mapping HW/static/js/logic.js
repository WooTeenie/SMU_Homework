$(document).ready(function() {
    makeMap();

    // event listener
    $("#timeframe").change(function() {
        makeMap();
    });
});

function makeMap() {
    var time_text = $("#timeframe option:selected").text();
    $("#maptitle").text(`All Earthquakes Recorded by the USGS for the ${time_text}`);

    var timeframe = $("#timeframe").val();
    var queryUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${timeframe}.geojson`

    $.ajax({
        type: "GET",
        url: queryUrl,
        success: function(data) {
            $.ajax({
                type: "GET",
                url: "static/data/PB2002_boundaries.json",
                success: function(tectonic) {
                    formMap(data, tectonic);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}

function formMap(data, tectonic) {
    $("#mapcontainer").empty();
    $("#mapcontainer").append(`<div id="mapid"></div>`);

    // Step 0: Create the Tile Layers
    var dark_mode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    var light_mode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    var satellite_mode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    // STEP 1: Form the Map
    // Create a map object
    var myMap = L.map("mapid", {
        center: [25.0, -15.0],
        zoom: 2.5,
        layers: [light_mode, dark_mode, satellite_mode]
    });

    //Step 2: Create Markers
    var earthquakes = [];
    var circle_list = [];
    data.features.forEach(function(earthquake) {
        var marker = L.geoJSON(earthquake, {
            onEachFeature: onEachFeature
        });
        earthquakes.push(marker);

        var circle = L.geoJSON(earthquake, {
            pointToLayer: function(feature, latlng) {
                var geojsonMarkerOptions = createMarkerOptions(feature);
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature
        });
        circle_list.push(circle);
    });

    var boundaries = L.geoJSON(tectonic, {
        color: "brown",
        weight: 3
    });

    var earthquake_markers = L.layerGroup(earthquakes);
    var earthquake_circles = L.layerGroup(circle_list);
    var tectonic_plate_layer = L.layerGroup([boundaries]);

    //STEP 3: Create Layers
    var baseMaps = {
        "Light Mode": light_mode,
        "Dark Mode": dark_mode,
        "Satellite Mode": satellite_mode,
    };

    var overlayMaps = {
        "Earthquake Location": earthquake_markers,
        "Earthquakes": earthquake_circles,
        "Tectonic Plates": tectonic_plate_layer
    };

    // Put Top Right Layer Legend onto the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Put the initial load layers on the Map
    boundaries.addTo(myMap);
    earthquake_circles.addTo(myMap);

    // Step 4: Create the Earthquake Legend

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        // create legend as raw html - just easier this way
        var legendInfo = `<h5 style = "margin-bottom:10px"> Earthquake Depth </h5>
        <div>
        <div style = "background:#98ee00;height:10px;width:10px;display:inline-block"> </div> 
        <div style = "display:inline-block"> Less than 10 Miles</div>
        </div> 
        <div>
        <div style = "background:#d4ee00;height:10px;width:10px;display:inline-block"></div> 
        <div style = "display:inline-block">10 - 30 Miles</div>
        </div>
        <div>
        <div style = "background:#eecc00;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">30 - 50 Miles</div>
        </div>
        <div>
        <div style = "background:#ee9c00;height:10px;width:10px;display:inline-block"></div> 
        <div style = "display:inline-block">50 - 70 Miles</div>
        </div>
        <div>
        <div style = "background:#ea822c;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">70 - 90 Miles</div>
        </div> 
        <div>
        <div style = "background:#ea2c2c;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">Greater than 90 Miles</div>
        </div>`;

        div.innerHTML = legendInfo;
        return (div)
    }

    // Adding legend to the map
    legend.addTo(myMap);
}

function createMarkerOptions(feature) {
    var depth = feature.geometry.coordinates[2];
    var depthColor = "";
    if (depth > 90) {
        depthColor = "#ea2c2c";
    } else if (depth > 70) {
        depthColor = "#ea822c";
    } else if (depth > 50) {
        depthColor = "#ee9c00";
    } else if (depth > 30) {
        depthColor = "#eecc00";
    } else if (depth > 10) {
        depthColor = "#d4ee00";
    } else {
        depthColor = "#98ee00";
    }

    var geojsonMarkerOptions = {
        radius: (feature.properties.mag * 4) + 1,
        fillColor: depthColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };

    return (geojsonMarkerOptions)
}

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.place) {
        layer.bindPopup(feature.properties.title);
    }
}