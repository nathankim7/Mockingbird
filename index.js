var express = require('express');
var router = express.Router();

router.post('/index', function(req, res) {
    console.log(req.body);
    res.end('OK');
});

module.exports = router;
