/*var express  = require('express');
const textToSpeech = require('@google-cloud/text-to-speech');

var router   = express.Router();

var projectId = process.env.projectId || "";
var instanceId = process.env.instanceId || "";
var databaseId = process.env.databaseId || "";
const fs = require('fs');
// Imports the Google Cloud client library
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
//GET pubsub page.  
router.get('/', function(req, res, next) {

  // The text to synthesize
  const text = 'Hello, world!';

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the Text-to-Speech request
  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error('ERROR:', err);
      return;
    }

    // Write the binary audio content to a local file
    fs.writeFile('output.mp3', response.audioContent, 'binary', err => {
      if (err) {
        console.error('ERROR:', err);
          res.send('ERROR:', err);
        return;
      }
      console.log('Audio content written to file: output.mp3');
      res.send('Audio content written to file: output.mp3');
    });
  });


});

module.exports = router;*/
