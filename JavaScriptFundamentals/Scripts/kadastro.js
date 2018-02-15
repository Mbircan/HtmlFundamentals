$(function () {

    console.log("yüklendi");
    $("#btnkonum").click(function () {
        navigator.geolocation.getCurrentPosition(getposition);
    });
});
function getposition(position) {
    var konum = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapdiv =document.getElementById("map");
    var settings = {
        center: konum,
        zoom: 15,
        mapTypeId: 'terrain',
        mapTypeControl:true,
    navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    }
    var map = new google.maps.Map(mapdiv, settings)
    var marker = new google.maps.Marker({
        position: konum,
        map: map,
        title: 'Şu an buradasınız',
        animation:google.maps.Animation.DROP
    });
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    var torpak = new google.maps.LatLng(41.4332655, 32.0412304);
    var service = new google.maps.DistanceMatrixService();
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService.route({
        origin: konum,
        destination: torpak,
        travelMode:google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        }
        else{
            alert("Rota çizilemedi. "+status);
        }
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("panel"));
    service.getDistanceMatrix(
      {
          origins: [konum],
          destinations: [torpak],
          travelMode: 'DRIVING',
          drivingOptions:{
              departureTime:new Date(),
              trafficModel:'bestguess'
          },
          unitSystem:google.maps.UnitSystem.METRIC,
          avoidHighways: true,
          avoidTolls: true,
      }, distance);
}
function distance(response, status) {
    console.log(response);
    console.log(status);
    if (status != 'OK'){
        alert('Mesafe ölçülemedi');
    }
    else {
        $("#bilgi").html("Gidilecek: " + response.destinationAddresses[0] + "<br/>Uzaklık: " + response.rows[0].elements[0].distance.text + "<br/>Süre: " + response.rows[0].elements[0].duration.text + "<br/>Trafik ile: " + response.rows[0].elements[0].duration_in_traffic.text);
    }

}