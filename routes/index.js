var express  = require('express');
var router   = express.Router();
var os       = require("os");
var hostname = os.hostname();
var fs       = require('fs');
/* GET home page. */

router.get('/', function(req, res, next) {

  fs.readFile('buildDetails', 'utf8', function(err, contents) {
    var buildDts = JSON.parse(contents);

    res.render('index', { title: '::Cloud Tester::', cloud: process.env.CLOUD,  container: hostname, buildID: buildDts.buildID, commitID: buildDts.commitID });
  });


});

module.exports = router;
