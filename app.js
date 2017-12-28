var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var config = require('./config.js');
var Twit = require('twit')
var gmc = require('@google/maps').createClient({
    key: 'AIzaSyDZIRqDmWn_wCUA7Nve57WVTM_dtSKRHJM'
});
var t = new Twit({
    consumer_key: 'ObvO3l8LZnhDhssFpCJPdCZkD',
    consumer_secret: 'dgLEKJdcandsbixvtmOhWhcYc4M5j8tnKLyio0eI921MPFmI7x',
    access_token: '2427918008-GhzHyKFMIc1twxLCaDirRjeRzUIEp2YPR5ee4lr',
    access_token_secret: 'zb5FbnQcQqq1OFMB8fFak0pmlgdIdiT3sAYYbXz9UNWlQ'
});
var curLoc;

app.set('port', (process.env.PORT || 3000));

// serve the static assets (js/dashboard.js and css/dashboard.css)
// from the public/ directory
app.use(express.static(path.join(__dirname, 'public/')));

// serve the index.html page when someone visits any of the following endpoints:
//    1. /
//    2. /about
//    3. /contact
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

io.on('connection', function(socket) {
    socket.on('location', function(loc) {
        console.log(loc);
        t.get('search/tweets', { q: '', count: 50, geocode: `${loc.lat},${loc.lng},0.3km` }, function(err, data, response) {
            var result = '';

            for (i = 0; i < data.statuses.length; i++) {
                console.log(data.statuses[i].text);
                result += '<strong>' + data.statuses[i].user.screen_name + '</strong>:' + data.statuses[i].text + '<br>';
            }

            io.emit('text', {cnt: data.statuses.length, result: result});
        });
    });
});

http.listen(app.get('port'), function() {
    console.log('listening on *:' + app.get('port'));
});
