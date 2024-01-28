// Charts
//geomap
// Creating the map object
let myMap = L.map("map", {
  center: [0, 100],
  zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);


// Get the data with d3.
let conLayer = L.conditionalMarkers([], {maxMarkers: 50});
d3.json("/api/geomap").then(function(response) {

  // Loop through the data.
  for (let i = 0; i < response['country'].length; i++) {
      // Add a new marker and bind a popup
      conLayer.addLayer(
        L.marker([response['lat'][i], response['long'][i]])
        .bindPopup("<h1>" + response['country'][i]+"</h1>" + "<hr>" + 
        "<strong> State: </strong>" + response['state'][i] + "<br>" + 
        "<strong> Confirmed cases: </strong>" + response['confirmed'][i] + "<br>" +
        "<strong> Deaths: </strong>" + response['deaths'][i])
      );
  }
  conLayer.addTo(myMap);

});



// Bubble Chart
function buildBubbleChart(region) {  

    url = 'api/bubble/'+region

    d3.json(url).then((data) => {

    let square = data['confirmed'].map((item) => {
        return Math.log2(item);
    });

    const colors = [];
    for (let i = 0; i < data['country'].length; i++) {
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(randomColor);
    };

    let bubbleData = [{
        x: data['country'],
          y: data['confirmed'],
          text: data['state'],
          mode: 'markers',
          marker: {
              color: colors,
              size: square
        } 
    }];

    let layout = {
      title: {
        text:"Total Covid Cases for " + region + " as of 2020-07-27",
        font: {family: 'Courier New, monospace', size:20},
        yref: 'paper',
        automargin: true
      },
      xaxis: {
        title:{
          text: "Country"
        }
      },
      yaxis: {
        title:{
          text: "Number of Total Cases"
        }
      }  
    };

      Plotly.newPlot("bubble", bubbleData, layout);
    });
}

function optionRegionChanged(newRegion) {
  buildBubbleChart(newRegion);
}

  // Bar Chart