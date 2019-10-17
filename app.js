//var http         = require("http");
var request      = require('request');
var express      = require('express');
var app          = express();
const port       = 8080;
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
const PubSub     = require('@google-cloud/pubsub');
const pubsub     = new PubSub();
//const spanner    = require('@google-cloud/spanner');
var spnrFns      = require('./spanner/dbfn.js');
/* pages */
var index       = require('./routes/index');
var health      = require('./routes/health');
var db          = require('./routes/db');
var kill        = require('./routes/kill');
var dialogflow  = require('./routes/dialogflow');
var pubsubPage  = require('./routes/pubsub');
var spannerPage = require('./routes/spannerPage');
var dlpPage     = require('./routes/dlp');
var loaderPage   = require('./routes/loaderio');


//var test2speech  = require('./routes/test2speech');
var status     = ""; // used for spanner callback status
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/health', health);
app.use('/kill', kill);
app.use('/db', db);
app.use('/pubsub', pubsubPage);
app.use('/dlp', dlpPage);
app.use('/dialogflow', dialogflow);
app.use('/spannerPage', spannerPage);
app.use('/loaderio-b1551541d32815292dec8c22ec8c1972', loaderPage);

app.post('/sendpubsub',function(req,res){

 var topicToken   = req.body.topicToken;
 var topicName    = req.body.topicName;
 var dataBuffer   = Buffer.from(req.body.pubsubMessage);

  pubsub
    .topic(topicName)
    .publisher()
    .publish(dataBuffer)
    .then(messageId => {
      console.log('Message ${messageId} published.');
      res.send('Message '+messageId +'published');
    })
    .catch(err => {
      console.error('ERROR:', err);
      res.send('Failure '+ err);
    });

});

app.post('/dbcreate',function(req,res){//create a new spanner DB
  var projectId  = req.body.projectId|| "";
  var instanceId = req.body.instanceId || "";
  var databaseId = req.body.databaseId || "";
  var response   = spnrFns.dbcreate(projectId,instanceId,databaseId,createPage);
//  res.send(response);
  function createPage(status){
     res.send(status);
  }

});

app.post('/dbinsert',function(req,res){//insert records in a spanner DB
  var projectId = req.body.projectId|| "";
  var instanceId = req.body.instanceId || "";
  var databaseId = req.body.databaseId || "";
  var table = req.body.table || "";
  var response   =  spnrFns.dbinsert(projectId,instanceId,databaseId,createPage);
//  res.send(response);
  function createPage(status){
     res.send(status);
  }
});

app.post('/dbquery',function(req,res){//query spanner DB
  var projectId = req.body.projectId|| "";
  var instanceId = req.body.instanceId || "";
  var databaseId = req.body.databaseId || "";
  var table = req.body.table || "";
  var response   =  spnrFns.dbquery(projectId,instanceId,databaseId,createPage);
    function createPage(status){
       res.send(status);
    }
});

// DialogFlow Request
app.post('/sendChat',function(req,res){
     var chatToken     = req.body.chatToken;
     var userMessage   = req.body.userMessage;
     var dialogToken   = req.body.dialogToken;
     var userSession   = req.body.userSession;
     var dialogFlowUrl = "https://api.dialogflow.com/v1/query?v=20150910";
     console.log("Request: "+userMessage);
     var data =`
      {
        "contexts": [],
        "lang": "en",
        "query": "`+userMessage+`",
        "sessionId": "`+userSession+`",
        "timezone": "America/New_York"
      }`;

      request({//dialog flow request
          url: dialogFlowUrl,
          method: "POST",
          headers: {
              "content-type": "application/json",
              "Authorization": "Bearer "+dialogToken
              },
          body: data
          }, function (error, resp, body) {
                console.log("Response: "+body)
                var botResp = JSON.parse(body);
                var intent  = botResp.result.metadata.intentName || "";
                var action  = botResp.result.action || "";
                var messageUser  = botResp.result.resolvedQuery;
                var messageAgent = botResp.result.fulfillment.speech;

                // Send messages to chatbase
                if(chatToken !=""){//log to chatbase
                  chatbase(chatToken,"user",botResp.sessionId,messageUser,messageAgent,action,intent);// send request to chatbase
                }
                res.send(body);
          });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function chatbase(chatToken,direction, sessionID, messageUser,messageAgent, action,intent){//send messages to chatbase

    var serverURL = "https://chatbase-area120.appspot.com/api/message";
    var data = {};
    data.api_key  = chatToken;
    data.type     = direction;
    data.message  = messageUser;
    data.platform = "demo-bot";

    if(action == "input.unknown"){
      data.not_handled = "true"
    }else{
        data.intent = intent;
    }
    data.version = "1.0";
    data.user_id = sessionID;
    console.log(JSON.stringify(data));
    request({//log user message to chatbase
        url: serverURL,
        method: "POST",
        headers: {
            "content-type": "application/json",
            },
        body: JSON.stringify(data)
        }, function (error, resp, body) {
            console.log("Chatbase-"+direction+": "+body)
            chatbaseAgent();

        });

    function chatbaseAgent(){//log agent message to chatbase
      var agentData = {};
      agentData.type     = "agent";
      agentData.message  = messageAgent;
      agentData.api_key  = chatToken;
      agentData.platform = "demo-bot";
      agentData.version = "1.0";
      agentData.user_id = sessionID;

      request({//dialog flow request
          url: serverURL,
          method: "POST",
          headers: {
              "content-type": "application/json",
              },
          body: JSON.stringify(agentData)
          }, function (error, resp, body) {
              console.log("Chatbase-agent: "+body)
              console.log("agent message:"+ messageAgent+" "+agentData.user_id );

          });
    }

}
