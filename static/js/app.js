// Charts
    // Geomap Chart 
    let myMap = L.Map("map", {
      center: [0, 100],
      zoom: 2.5
  });

  // Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Bubble Chart
  let bubbleData = [{
          x: x[''],
          y: y[''],
          text: [''],
          mode: '',
          marker: {
              color: [''],
              size: ['']
          }
      }];
      Plotly.newPlot("bubble", bubbleData);

  // Bar Chart

  var trace1 = {
      type: '',
      x: data[''],
      y: data[''],
      marker: {
          color: '',
      }
    };
