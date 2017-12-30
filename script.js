var socket;
var map;
var infoWindow;
var curr = 0;
var ci = 0;
var content = [];

function initMap() {
    map = new google.maps.Map($('#map')[0], {
        center: {lat: -34.397, lng: 150.644},
        zoom: 15
    });
    infoWindow = new google.maps.InfoWindow({maxWidth: 200});

    var x = {lat: 0, lng: 0};

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            x.lat = position.coords.latitude;
            x.lng = position.coords.longitude;

            console.log('Your current position is:');
            console.log(`Latitude : ${position.coords.latitude}`);
            console.log(`Longitude: ${position.coords.longitude}`);
            console.log(`More or less ${position.coords.accuracy} meters.`);
            map.setCenter(x);
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: x,
                radius: 1500,
                type: ['bakery', 'cafe', 'restaurant', 'bar']
            }, callback);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var arr = [];

        for (var i = 0; i < results.length; i++) {
            createMarker(results[i], i);
            arr.push([]);
            arr[i].push(curr);
            arr[i].push(i);
        }

        arr.sort(compare);
        for (var i = 0; i < results.length; i++) {
            var temp = '#' + (i + 1);
            $(temp).text(results[arr[i][1]].name + " " + arr[i][0]);
        }
    }
}

function compare(a, b) {
    return a[0] - b[0];
}

function createMarker(place, index) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    var temp = {lat: placeLoc.lat(), lng: placeLoc.lng()};
    console.log('index: ' + index);
    socket.emit('location', temp);
    console.log('request ' + temp);

    socket.on('text', function(results) {
        console.log('response: ' + results.result);
        content[ci] = '<strong><i>' + place.name + '</i></strong><br>' + results.result;
        console.log('content: ' + content[ci]);
        console.log('ci: ' + ci);
        ci++;
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(content[index]);
        infoWindow.open(map, this);
    });
}
