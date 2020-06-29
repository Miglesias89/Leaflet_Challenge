var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


function getColor(mag) {
    return      mag >= 6 ? '#ff3300' :
                mag >= 5 ? '#ff9900' :
                mag >= 4 ? '#ffc266' :
                mag >= 3 ? '#ffcc66' :
                mag >= 2 ? '#ccff99' :
                mag >= 1 ? '#66ff33' :
                           '#66ff66' ;
           
    }

//Create Map function
function createMap(earthquakes) {

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

var baseMaps ={
    "Light Map": lightmap
};

var overlayMaps = {
    "Earthquakes": earthquakes
};

var map = L.map("map", {
    center: [15.5994,-28.6731],
    zoom:3,
    layers: [lightmap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

//Set up the legend
var legend = L.control({position: 
    "bottomright" });
legend.onAdd = function() {

    var div = L.DomUtil.create('div', 'info legend'),
    labels = [1, 2, 3, 4, 5, 6];

    div.innerHTML += '<h3>Magnitude</h3>'
    
    for (var i = 0; i< labels.length; i++) {
        div.innerHTML += 
          
        '<div style = "background:' + getColor(labels[i]) + '">'
        + labels[i] + (labels[i + 1] ? ' - ' + labels[i + 1] : '+') +
        '</div>';
    }

    return div;
};

legend.addTo(map);

}

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup ("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "<p> Place: " + feature.properties.place + "</p>" +
        "<p> Magnitude: " + feature.properties.mag + "</p>");
    }

    var geojsonMarkerOptions = {
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },

        style: function(feature) {
        var mag = feature.properties.mag;
           if (mag >= 6.0) {
               return { color:'#ff3300'};
           }
           else if (mag >= 5.0) {
               return { color: '#ff9900'};
           }
           else if (mag >= 4.0) {
               return { color: '#ffc266'};
           }
           else if (mag >= 3.0) {
               return { color: '#ffcc66' };
           }
           else if (mag >= 2.0) {
               return { color: '#ccff99'}
           }
           else {
               return { color: '#66ff33'  }
           }
           
        },

        onEachFeature: onEachFeature,
});

    createMap(earthquakes);

}

//Get request for JSON data
d3.json(geoData, function(data) {
    createFeatures(data.features);
});