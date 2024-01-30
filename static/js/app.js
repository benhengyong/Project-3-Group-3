// Charts
//geomap
// Creating the map object
let myMap = L.map("map", {
  center: [0, 100],
  zoom: 2
});

// Adding the tile layer
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
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


// Creating the bar graph object
let dropdown;
let data;
init()
function init() {
  // Fetch the country list and populate the dropdown
  d3.json("/api/countrylist").then((data) => {
      // Select the dropdown element by ID
    dropdown = d3.select("#selDataset");
    // Populate the dropdown with options from the data
    data.country.forEach(function (country) {
      dropdown.append("option").text(country).property("value", country);
    });
    var e = document.getElementById("selDataset");
    //var text = e.options[e.selectedIndex].text;
    optionChanged(e.options[e.selectedIndex].text)
  });
}

//Function to fetch data from the Flask API
function fetchData(region)
{
    return fetch(`/api/bar/${region}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);})
        .catch(error => console.error('Error:', error));
}
//buildCountryChart('India')
function buildCountryChart(country) {
    d3.json(`/api/bar/${country}`).then((data) => {
      const months = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul'};
        // Check if data is an array before using map
        if (Array.isArray(data.Total_confirmed)) {
            // Map the month numbers to month names
            const formattedData = data.Total_confirmed.map((value, index) => ({
                Total_confirmed: value,
                Total_deaths: data.Total_deaths[index],
                Total_recovered: data.Total_recovered[index],
                country: data.country[index],
                month: months[data.month[index]],
            }));
    };
      var trace1 = {
        type: 'bar',
        x: data['date'],
        y: data['confirmed'],
        name: 'Confirmed',
        marker: {
          color: '#1F77B4',
        },
      };
      var trace2 = {
        type: 'bar',
        x: data['date'],
        y: data['recovered'],
        name: 'Recovered',
        marker: {
          color: '#2CA02C',
        },
      };
      var trace3 = {
        type: 'bar',
        x: data['date'],
        y: data['deaths'],
        name: 'Deaths',
        marker: {
          color: '#D62728',
        },
      };
      var plotData = [trace1, trace2, trace3];
      var layout = {
        title: 'COVID-19 Statistics',
        barmode: 'stack',  // Stacked bar chart
        width: 500,
        height: 390
      };
      var config = { responsive: true };
      Plotly.newPlot('sample-metadata', plotData, layout, config);
    });
  };

  // Function to handle dropdown selection changes
function optionChanged(selectedCountry) {
  // Call the function to update charts based on the selected country
  buildCountryChart(selectedCountry);
}