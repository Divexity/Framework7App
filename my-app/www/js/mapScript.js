var mymap = L.map('mapid', {
  center: [52.5347702, 6.0551927],
  zoom: 13
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2Fhc3NhdXMiLCJhIjoiY2pwcjA3dGc1MTR6ajQybnozNWNmbng0aSJ9.3394n_zdn8UonRkDTROaew', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);

app.request.get('https://opendata.arcgis.com/datasets/5aef2dab5bc54db2bdc257011f3a426c_0.geojson', function (data) {
  var geoObject = JSON.parse(data);
  var features = [];

  features = geoObject.features;
  console.log(features);

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize:     [38, 95],
      shadowSize:   [50, 64],
      iconAnchor:   [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor:  [-3, -76]
    }
  });

  var greenIcon = new LeafIcon({
    iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
    shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
  });

  features.forEach(function (value) {
    var geometryArray = [value["geometry"]["coordinates"][1], value["geometry"]["coordinates"][0]];
    L.marker(geometryArray, {icon: greenIcon}).addTo(mymap);
  });
});
