var express  = require('express');
var router   = express.Router();

var projectId = process.env.projectId || "";
var instanceId = process.env.instanceId || "";
var databaseId = process.env.databaseId || "";

/* GET pubsub page. */
router.get('/', function(req, res, next) {


  res.render('spanner', { title: 'Google Cloud Tester', projectId:projectId, instanceId:instanceId,databaseId:databaseId });

});

module.exports = router;
