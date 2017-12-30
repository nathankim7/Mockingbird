var express = require('express');
var app = express();
var io = require('socket.io')(require('http').Server(app));
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
app.use(express.static(path.join(__dirname, 'public/')));
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

            io.emit('text', {
                cnt: data.statuses.length,
                result: result
            });
        });
    });
});

app.listen(app.get('port'), function() {
    console.log('listening on *:' + app.get('port'));
});
