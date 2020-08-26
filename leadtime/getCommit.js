const https = require('https');
const args = process.argv.slice(1)

// Calculate difference between current and gitcommit times
const repo        = args[1]; //Commit Repo
const commit      = args[2]; //Commit SHA
const commitTime  = args[3];//PR time
const currentTime = (Date.now()/1000);//convert milliseconds to seconds

var leadtime  = diff_time(commitTime, currentTime);//working 
console.log(leadtime);
isRollback(commit,repo,leadtime);//get rollback data then print to log

function diff_time(dt1, dt2) {
    var diff =(dt2 - dt1);
    var minutesRaw = (diff/60);//leadtime in minutes
  return minutesRaw.toFixed(2); //minutes with 2 decimals
 }

 function isRollback(commit,repo, leadtime){// compare current commit against latest master branch 
     var options = {
    host: 'api.github.com',
    port: 443,
    path: '/repos/'+repo+'/commits/master',
     headers: { 'User-Agent': 'node' },
    method: 'GET'
    };


     https.get(options, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // Response has been received. Print out the result and see if current commit is latest
  resp.on('end', () => {
    var gitDataObj2 = JSON.parse(data);
   
    if (args[3] === gitDataObj2.sha){//commit matches master
          console.log("Commit: " +commit+" || Rollback: False || LeadTime: "+leadtime);
    }else{//commit doesn't match latest, must be rollback
         console.log("Commit: " +commit+" || Rollback: True || LeadTime: "+leadtime);
    }
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
 }