var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var index = require('./index.js');

// Define the port to run on
app.set('port', 3000);
 
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/index', index);

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

console.log('trace')
var Twit = require('twit')
var gmc = require('@google/maps').createClient({
    key: 'AIzaSyDZIRqDmWn_wCUA7Nve57WVTM_dtSKRHJM'
})

var t = new Twit({
    consumer_key: 'ObvO3l8LZnhDhssFpCJPdCZkD',
    consumer_secret: 'dgLEKJdcandsbixvtmOhWhcYc4M5j8tnKLyio0eI921MPFmI7x',
    access_token: '2427918008-GhzHyKFMIc1twxLCaDirRjeRzUIEp2YPR5ee4lr',
    access_token_secret: 'zb5FbnQcQqq1OFMB8fFak0pmlgdIdiT3sAYYbXz9UNWlQ'
})

t.get('search/tweets', { q: 'since:2016-01-01', count: 10, geocode: `${43.6598948},${-79.39600940000003},0.5km` }, function(err, data, response) {
    for (i = 0; i < data.statuses.length; i++) {
        console.log(data.statuses[i].place)
    }
})

t.get('geo/search', { lat: 43.6598948, long: -79.39600940000003, granularity: 'poi', accuracy: 1000000000, max_results: 20 }, function(err, data, response) {
    for (i = 0; i < data.result.places.length; i++) {
        console.log(data.result.places[i].id + " " + data.result.places[i].full_name);
    };
})
