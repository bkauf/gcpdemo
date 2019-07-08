var express  = require('express');
var router   = express.Router();
var os       = require("os");
var hostname = os.hostname();
var fs       = require('fs');
/* GET home page. */
fs.readFile('buildID', 'utf8', function(err, contents) {
    var buildID = contents;
});

router.get('/', function(req, res, next) {


  res.render('index', { title: '::Cloud Tester::', container: hostname, buildID: buildID });
});

module.exports = router;
