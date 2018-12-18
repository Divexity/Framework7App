if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (location) {
    const latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

    const mymap = L.map('mapid', {
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
      const geoObject = JSON.parse(data);
      features = geoObject.features;

      const LeafIcon = L.Icon.extend({
        options: {
          iconSize: [38, 95],
          shadowSize: [50, 64],
          iconAnchor: [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor: [-3, -76]
        }
      });

      const greenIcon = new LeafIcon({
        iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
      });

      const orangeIcon = new LeafIcon({
        iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-orange.png',
        shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
      });

      const userlocation = L.marker(latlng, {icon: orangeIcon}).addTo(mymap);
      userlocation.bindPopup("Uw locatie");
      userlocation.on('mouseover', function (e) {
        this.openPopup();
      });

      const dataArray = [];

      features.forEach(function (value, index) {
        const geometryArray = [value["geometry"]["coordinates"][1], value["geometry"]["coordinates"][0]];
        const geometryLocations = L.marker(geometryArray, {icon: greenIcon}).on('click', function () {
          centerLeafletMapOnMarker(mymap, this, value["properties"]["OBJECTID"]);
        }).addTo(mymap);
        let locationArray = false;

        const dataArrayInit = [value, distance(latlng["lat"], latlng["lng"], geometryArray[0], geometryArray[1], "K").toFixed(2)];
        getLocation(geometryArray, function(data) {
          locationArray = data;
          geometryLocations.bindPopup("<p><span class=\"badge color-green\">" + value["properties"]["OBJECTID"] + "</span>" + ' ' + locationArray["address"]["road"] + ' ' + locationArray["address"]["house_number"] + "</p>");

          dataArrayInit.push(locationArray);
        });
        geometryLocations.on('mouseover', function (e) {
          this.openPopup();
        });
        dataArray.push(dataArrayInit);
      });
      const sortedDataArray = dataArray.sort();

      let dataList = '<ul>';

      sortedDataArray.forEach(function (value, index) {
        console.log(value[2]);
        dataList += '<li class="accordion-item ' + value[0]["properties"]["OBJECTID"] + '">';
        dataList += '<a href="#" class="item-content item-link">';
        dataList += '<div class="item-inner">';
        dataList += '<div class="item-title"><span class="badge color-green">' + value[0]["properties"]["OBJECTID"] + '</span>' + ' - ' +  + value[1] + ' Kilometer</div>';
        dataList += '</div>';
        dataList += '</a>';
        dataList += '<div class="accordion-item-content">';
        dataList += '<div class="block">';
        dataList += '<p><b>' + new Date(value[0]['properties']['timestamp_from']).toLocaleDateString() + ' - ' + new Date(value[0]['properties']['timestamp_to']).toLocaleDateString() + '</b></p>' +
          '<p>' + 'Temperatuur: ' + value[0]["properties"]["value_T"] + ' °C</p>' +
          '<p>' + 'Relatieve vochtigheid: ' + value[0]["properties"]["value_RH"] + ' %</p>' +
          '<p>' + 'Luchtdruk: ' + value[0]["properties"]["value_P"] + ' hPa</p>' +
          '<p>' + 'Fijne stof: ' + value[0]["properties"]["value_PM10"] + ' ug/m3</p>' +
          '<p>' + 'Stikstofdioxide: ' + value[0]["properties"]["value_NO2"] + ' ug/m3</p>';
        dataList += '</div>';
        dataList += '</div>';
        dataList += '<div class="sortable-handler"></div>';
        dataList += '</li>';
      });

      dataList += '</ul>';
      $$(".senshagen-data").html(dataList);
    });
  }, showError);
} else {
  app.dialog.alert('Error');
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      app.dialog.alert('User denied the request for Geolocation.');
      break;
    case error.POSITION_UNAVAILABLE:
      app.dialog.alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      app.dialog.alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      app.dialog.alert("An unknown error occurred.");
      break;
  }
}

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
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
  const latLngs = [marker.getLatLng()];
  const markerBounds = L.latLngBounds(latLngs);
  map.fitBounds(markerBounds);
  app.accordion.open(document.getElementsByClassName(index));
}

function getLocation([lat, lon], callback) {
  app.request.get('https://nominatim.openstreetmap.org/reverse?format=json&lat='+ lat +'&lon=' + lon , async = true, function (data) {
    callback(JSON.parse(data));
  });
}
