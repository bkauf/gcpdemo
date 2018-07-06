var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next) {
  res.send('Kill environment variable set! Health variable=bad!');
  global.health = "bad";
});

module.exports = router;
