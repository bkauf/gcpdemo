
//var COMMIT_SHA = '6922b00c842193f85780dda8ad3b8e117a3292e1';
//var REPO_NAME = 'bkauf/gcpdemo';
const args = process.argv.slice(1)
const https = require('https');

var options = {
  host: 'api.github.com',
  port: 443,
  path: '/repos/'+args[1]+'/commits/'+args[2],
  headers: { 'User-Agent': 'node' },
  method: 'GET'
};


https.get(options, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    var gitDataObj = JSON.parse(data);
    if (typeof gitDataObj.commit === 'undefined'){
         console.log("could not find git details: "+options.host+options.path);
        
    }else{
        console.log("Commit Author: "+gitDataObj.commit.author.name);
        console.log("Commit Date: "+gitDataObj.commit.author.date);

        // Calculate difference between current and gitcommit times
        dt1 = new Date(gitDataObj.commit.committer.date).getTime();
        dt2 = Date.now();
        console.log('commit-date-test:'+dt1);
        var leadtime = diff_hours(dt1, dt2);
        var commit = args[2];

        isRollback(commit,leadtime);
       

    }

  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});




function diff_hours(dt1, dt2) 
 {

  var diff =(dt2 - dt1);
  var randomGen =Math.floor((Math.random() * 800) + 60);
  var minutesRaw = (diff/60000)+randomGen;//temp random time for testing
  // var minutes = Math.floor(diff / 60000);
  // var seconds = ((diff % 60000) / 1000).toFixed(0);
  //return minutes + ":" + seconds;
  return minutesRaw.toFixed(2); //minutes with 2 decimals
 }


 function isRollback(commit, leadtime){
     var options2 = {
    host: 'api.github.com',
    port: 443,
    path: '/repos/'+args[1]+'/commits/master',
     headers: { 'User-Agent': 'node' },
    method: 'GET'
    };


     https.get(options2, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // Response has been received. Print out the result and see if current commit is latest
  resp.on('end', () => {
    var gitDataObj2 = JSON.parse(data);
   
    if (args[2] === gitDataObj2.sha){//commit matches master
          console.log("Commit: " +commit+" || Rollback: False || LeadTime: "+diff_hours(dt1, dt2));
    }else{//commit doesn't match latest, must be rollback
         console.log("Commit: " +commit+" || Rollback: True || LeadTime: "+diff_hours(dt1, dt2));
    }
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
 }