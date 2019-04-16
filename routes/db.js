var express     = require('express');
var router      = express.Router();
var db          = '';
var MongoClient = require('mongodb').MongoClient;
var randomWords = require('random-words');
var newdb       = randomWords();
var url         = "mongodb://database/"+newdb;

router.get('/', function(req, res, next) {

  //  MongoClient.connect(url, function(err, db) {
  //    if (err) throw err;
  //        console.log("Database created: "+newdb);
         res.send("Database created: "+newdb);
//      db.close();
//    });

});

module.exports = router;
