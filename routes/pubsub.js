var express  = require('express');
var router   = express.Router();
var os       = require("os");
var hostname = os.hostname();
var psTopic  = process.env.PUBSUB_TOPIC || "";
var psToken  = process.env.PUBSUB_VERIFICATION_TOKEN || "";

/* GET pubsub page. */
router.get('/', function(req, res, next) {


  res.render('pubsub', { title: 'Google Cloud Tester', topic:psTopic, token:psToken });

});

module.exports = router;
