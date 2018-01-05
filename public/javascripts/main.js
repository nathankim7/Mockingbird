$(function() {
    const google = window.google;
    var map;
    var infowindow;
    var socket = io();
    var pos = { lat: -34.397, lng: 150.644 };
    var service;
    var geocoder;
    var requests = 0;

    socket.on('tweet', (data) => {
        if (data)
            callback(data);
    });

    async function callback(data) {
        geocodeLatLng(geocoder, { lat: data.coordinates[0], lng: data.coordinates[1] });
        requests++;
    }

    function initMap() {
        map = new google.maps.Map($('#map')[0], {
            center: pos,
            zoom: 15
        });
        geocoder = new google.maps.Geocoder;
        service = new google.maps.places.PlacesService(map);
        infowindow = new google.maps.InfoWindow({ maxWidth: 200 });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                console.log(`Latitude : ${position.coords.latitude}`);
                console.log(`Longitude: ${position.coords.longitude}`);
                console.log(`More or less ${position.coords.accuracy} meters.`);

                map.setCenter(pos);
                socket.emit('twitter', pos);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            }, { enableHighAccuracy: true });
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.types[0] + '<br>' + place.formatted_address);
            infowindow.open(map, this);
        });
    }

    function geocodeLatLng(geocoder, place) {
        geocoder.geocode({ 'location': place }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    service.getDetails({ placeId: results[0].place_id }, (place, status) => {
                        if (status == google.maps.places.PlacesServiceStatus.OK)
                            createMarker(place);
                    });
                } else {
                    window.alert('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    }

    initMap();
});
