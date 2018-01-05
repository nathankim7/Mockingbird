var express = require('express');
var router = express.Router();
var Twit = require('twit');
var t = new Twit({
  consumer_key: 'ObvO3l8LZnhDhssFpCJPdCZkD',
  consumer_secret: 'dgLEKJdcandsbixvtmOhWhcYc4M5j8tnKLyio0eI921MPFmI7x',
  access_token: '2427918008-GhzHyKFMIc1twxLCaDirRjeRzUIEp2YPR5ee4lr',
  access_token_secret: 'zb5FbnQcQqq1OFMB8fFak0pmlgdIdiT3sAYYbXz9UNWlQ'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.x = ['', '', '', '', '', '', '', '', '', ''];

  res.render('index', { 
    title: 'Mockingbird',
    y: res.locals.x
  });

  res.io.on('connection', (socket) => {
    socket.on('twitter', function (loc) {
      res.locals.x.push('');
      t.get('search/tweets', { q: '', count: 100, geocode: `${loc.lat},${loc.lng},2km`, since_id: 1 }, function(err, data, response) {
        console.log(data.statuses.length);

        for (i = 0; i < data.statuses.length; i++)
          socket.emit('tweet', data.statuses[i].geo);
      });
    });
  }); 
});

module.exports = router;
