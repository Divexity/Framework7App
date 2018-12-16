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
