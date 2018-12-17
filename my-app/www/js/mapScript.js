navigator.geolocation.getCurrentPosition(function(location) {
  var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

  var mymap = L.map('mapid', {
    center: latlng,
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

    var LeafIcon = L.Icon.extend({
      options: {
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
      }
    });

    var greenIcon = new LeafIcon({
      iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
      shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    });

    var orangeIcon = new LeafIcon({
      iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-orange.png',
      shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    });

    var userlocation = L.marker(latlng, {icon: orangeIcon}).addTo(mymap);
    userlocation.bindPopup("Uw locatie");
    userlocation.on('mouseover', function (e) {
      this.openPopup();
    });

    var dataList = '<ul>';

    features.forEach(function (value, index) {
      var geometryArray = [value["geometry"]["coordinates"][1], value["geometry"]["coordinates"][0]];
      var geometryLocations = L.marker(geometryArray, {icon: greenIcon}).on('click', function () {
        centerLeafletMapOnMarker(mymap,this,index);
      }).addTo(mymap);
      geometryLocations.bindPopup("<h3>ID - OBJECTID</h3><p>"+ value["properties"]["OBJECTID"] + " - " + value["properties"]["id"] +"</p>");
      geometryLocations.on('mouseover', function (e) {
        this.openPopup();
      });

      dataList += '<li class="accordion-item '+ index + '">';
      dataList += '<a href="#" class="item-content item-link">';
      dataList += '<div class="item-inner">';
      dataList += '<div class="item-title">'+ value["properties"]["OBJECTID"] + ' - ' + distance(latlng["lat"], latlng["lng"], geometryArray[0], geometryArray[1], "K").toFixed(2) +' Kilometer</div>';
      dataList += '</div>';
      dataList += '</a>';
      dataList += '<div class="accordion-item-content">';
      dataList += '<div class="block">';
      dataList += '<p><b>'+ new Date(value['properties']['timestamp_from']).toLocaleDateString() +' - '+ new Date(value['properties']['timestamp_to']).toLocaleDateString() +'</b></p>' +
        '<p>'+ 'Temperatuur: '+ value["properties"]["value_T"]+ ' °C</p>' +
        '<p>'+ 'Relatieve vochtigheid: '+ value["properties"]["value_RH"] +' %</p>' +
        '<p>'+ 'Luchtdruk: '+ value["properties"]["value_P"] +' hPa</p>' +
        '<p>'+ 'Fijne stof: '+ value["properties"]["value_PM10"] + ' ug/m3</p>' +
        '<p>'+ 'Stikstofdioxide: '+ value["properties"]["value_NO2"] + ' ug/m3</p>';
      dataList += '</div>';
      dataList += '</div>';
      dataList += '<div class="sortable-handler"></div>';
      dataList += '</li>';
    });

    dataList += '</ul>';
    $$(".senshagen-data").html(dataList);
  });
});

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
  }
}

function centerLeafletMapOnMarker(map, marker, index) {
  var latLngs = [ marker.getLatLng() ];
  var markerBounds = L.latLngBounds(latLngs);
  map.fitBounds(markerBounds);
  app.accordion.open(document.getElementsByClassName(index));
  console.log('.' + index);
}
