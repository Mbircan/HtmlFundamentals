var apiurl = "https://api.foursquare.com/v2/venues/search";
var clientid = "Y5OEQAF5PSYBBGI3CWXRGFGG5C24GUQMVRMDU1VFIOLO4DWZ";
var clientsecret = "FJS5ZIWL43MEPKI0CT0AQHLPP5UFKWUN15HGMV2RAXSEK41I";
var categoriid = "4d4b7105d754a06374d81259";
$("#txtara").keyup(function () {
    var arama = this.value;
    var query = apiurl;
    query += "?client_id=" + clientid;
    query += "&client_secret=" + clientsecret;
    query += "&v=20180126";
    query += "&categoryId=" + categoriid;
    query += "&near=Istanbul,TR";
    query += "&query=" + arama;
    $.ajax({
        url: query,
        dataType: 'JSON',
        type:'get'
    }).done(function (data) {
        //console.log(data.response.venues);
        $("#mekanlar").empty();
        $.each(data.response.venues, function (key, value) {
            kartolustur(value);
		})
        $(".firmakarti").click(function () {
            mekandetay(this.id)
        });
    });
});
function kartolustur(venue) {
    var kartdiv = document.createElement("div");
	$(kartdiv).addClass("firmakarti");
	$(kartdiv).attr("id", venue.id);
	$(kartdiv).attr("durum", false);
    var h3 = document.createElement("h3");
    $(h3).html(venue.name);
    var adresdiv = document.createElement("div");
    $(adresdiv).addClass("adres").html(venue.location.address+"<br/>"+venue.contact.phone);
    var buradadiv = document.createElement("div");
    $(buradadiv).addClass("burada").html(venue.hereNow.summary);
    $(kartdiv).append(h3).append(adresdiv).append(buradadiv).appendTo($("#mekanlar"));

}
function mekandetay(id) {
	//console.log(id);
    var query = "https://api.foursquare.com/v2/venues/";
    query += id;
    query += "?client_id=" + clientid;
    query += "&client_secret=" + clientsecret;
    query += "&v=20180126";
    $.ajax({
        url: query,
        dataType: "JSON",
        type:"get"
	}).done(function (data) {
	    console.log(data.response.venue);
	    goturbeni(data.response.venue.location);
		if (data.response.venue.bestPhoto === undefined) {
			$("#" + id).empty().css({
				"text-align": "center",
				"font-size": "30px"
			}).html("Fotoğraf Bulunamadı.");
			return;
		}
		var boyut = $("#" + id).width() + 'x' + $("#" + id).height();
		$("#" + id).empty().css("background-image", 'url(' + data.response.venue.bestPhoto.prefix + boyut + data.response.venue.bestPhoto.suffix + ')');
    })
}

function goturbeni(hedef) {
    $("#tarif").fadeIn(1000);
    $("#aciklama").empty();
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        var konum = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapdiv = document.getElementById("map");
        var settings = {
            center: konum,
            zoom: 15,
            mapTypeId: 'roadmap',
            mapTypeControl: true,
            navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
        }
        var map = new google.maps.Map(mapdiv, settings)
        var marker = new google.maps.Marker({
            position: konum,
            map: map,
            title: 'Şu an buradasınız',
            animation: google.maps.Animation.DROP
        });
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
        var gidilecek = new google.maps.LatLng(hedef.lat, hedef.lng);
        var service = new google.maps.DistanceMatrixService();
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsService.route({
            origin: konum,
            destination: gidilecek,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
            }
            else {
                alert("Rota çizilemedi. " + status);
            }
        });
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("aciklama"));
        service.getDistanceMatrix(
            {
                origins: [konum],
                destinations: [gidilecek],
                travelMode: 'DRIVING',
                drivingOptions:{
                departureTime:new Date(),
                trafficModel:'bestguess',
            },
            unitSystem:google.maps.UnitSystem.METRIC,
            avoidHighways:true,
            avoidTolls:true,
            }, function (response, status) {
            if (status != 'OK') {
                alert('Mesafe ölçülemedi');
            }
            else {
                $("#bilgi").html("Gidilecek: " + response.destinationAddresses[0] + "<br/>Uzaklık: " + response.rows[0].elements[0].distance.text + "<br/>Süre: " + response.rows[0].elements[0].duration.text + "<br/>Trafik ile: " + response.rows[0].elements[0].duration_in_traffic.text);
            }
        });
    });

}