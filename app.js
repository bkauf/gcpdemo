//var http         = require("http");
var request      = require('request');
var express      = require('express');
var app          = express();
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
const PubSub     = require('@google-cloud/pubsub');
const pubsub     = new PubSub();
/* pages */
var index      = require('./routes/index');
var health     = require('./routes/health');
var kill       = require('./routes/kill');
var dialogflow = require('./routes/dialogflow');
var pubsubPage = require('./routes/pubsub');


// test
//# view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/health', health);
app.use('/kill', kill);
app.use('/pubsub', pubsubPage);
app.use('/dialogflow', dialogflow);



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
                var messageUser  = botResp.result.resolvedQuery;
                var messageAgent = botResp.result.fulfillment.speech;

                // Send messages to chatbase
                chatbase(chatToken,"user",botResp.sessionId,messageUser,messageAgent,botResp.result.action,intent);// send request to chatbase

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

function chatbase(chatToken,direction, sessionID, messageUser,messageAgent, fulfillment,intent){//send messages to chatbase

    var serverURL = "https://chatbase-area120.appspot.com/api/message";
    var data = {};
    data.api_key  = chatToken;
    data.type     = direction;
    data.message  = messageUser;
    data.platform = "demo-bot";
    if(direction == "user" && intent !=""){
      data.intent = intent;
    }
    if(intent == "input.unknown" || intent == "Default Fallback Intent" || intent ==""){
      data.not_handled = "true"
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
      data.type     = "agent";
      data.message  = messageAgent;
      data.intent = "";
      data.not_handled = ""
      request({//dialog flow request
          url: serverURL,
          method: "POST",
          headers: {
              "content-type": "application/json",
              },
          body: JSON.stringify(data)
          }, function (error, resp, body) {
              console.log("Chatbase-agent: "+body)
              console.log("agent message:"+ messageAgent+" "+data.user_id );

          });
    }

}
