// API for the past 7 days
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(magnitude) {
  return magnitude * 5;
}

//Assign the colors to the range of magnitude
function getColor(magnitude) {
    if (magnitude >= 5) {
      return '#330000'
  } else if (magnitude >= 4) {
      return '#990000'
  } else if (magnitude >= 3) {
      return '#ff0000'
  } else if (magnitude >= 2) {
      return '#ff6666'
  } else if (magnitude >= 1) {
      return '#ff9999'
  } else {
      return '#ffcccc'
  }
};

var API_KEY = "sk.eyJ1IjoibW9sbHlic3RldyIsImEiOiJjazBqc21odXQwZTQ1M2tvMmhwdXhsYnk4In0.0Y7eRx0VVjvjLhNncoeMAA";

function createMap(earthquakes) {
 
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,\
     <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,\
     <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
    });

  // Object to hold the base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Object to hold overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create map object
  var myMap = L.map("map", {
    center: [39.83333, -98.58333],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function(){
    labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += "<h3 style='margin:4px'>Magnitude</h3>"

    for (var i = 0; i <= 5; i++) {
      div.innerHTML += '<p><span style="background:' + getColor(i) +
        ';">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + labels[i] + '</p>';
    }
    
    return div;
  };

  legend.addTo(myMap);
};

//createFeatures function
function createFeatures(earthquakeData) {
  
  function popUpText(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>Magnitude: " + feature.properties.mag + "</p>" +
      "<p>Type: " + feature.properties.type + "</p>");
  };
  
  var baseMarkerOptions = {
    color: '#191919',
    weight: 1,
    fillOpacity: 0.9
  };

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, baseMarkerOptions);
    }, 
    style: function(feature) {
      return {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.properties.mag)
      }
    },
    onEachFeature: popUpText
  });


  createMap(earthquakes);
};

// GET request for JSON data
d3.json(baseURL, function(data) {
  createFeatures(data.features);
});