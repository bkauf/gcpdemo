var express       = require('express');
var router        = express.Router();
var os            = require("os");
var chatbaseToken = process.env.CHATBASE_API || "CHATBASE_API";
var dialogToken   = process.env.DIALOG_TOKEN ||  "DIALOG_TOKEN";

/* GET Dialogflow API page. */
router.get('/', function(req, res, next) {

  res.render('dialogFlow', { title: 'Google Cloud Tester - Dialogflow', chatToken:chatbaseToken, dialogToken:dialogToken });

});
module.exports = router;
