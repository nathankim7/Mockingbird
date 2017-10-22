// require Express and Socket.io
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
  // a user has visited our page - add them to the visitorsData object
  console.log('connect');

  socket.on('disconnect', function() {
    // a user has left our page - remove them from the visitorsData object
    console.log('disconnect');
  });

  socket.on('location', function(loc) {
      console.log(loc);
      t.get('search/tweets', { q: 'since:2016-01-01', count: 10, geocode: `${loc.lat},${loc.lng},0.5km` }, function(err, data, response) {
        var result = '';

        for (i = 0; i < data.statuses.length; i++) {
            console.log(data.statuses[i].text);
            result += '<strong>' + data.statuses[i].user.screen_name + '</strong>:' + data.statuses[i].text + '<br>';
        }

        io.emit('text', result);
      });
  });
});

t.get('geo/search', { lat: 43.6598948, long: -79.39600940000003, granularity: 'poi', accuracy: 1000000000, max_results: 20 }, function(err, data, response) {
    for (i = 0; i < data.result.places.length; i++) {
        console.log(data.result.places[i].id + " " + data.result.places[i].full_name);
    };
})

http.listen(app.get('port'), function() {
  console.log('listening on *:' + app.get('port'));
});
