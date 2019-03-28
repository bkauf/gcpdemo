var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next) {
  res.send('DB Connection');

});

module.exports = router;
