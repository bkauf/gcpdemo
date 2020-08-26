
const args = process.argv.slice(1)

// Calculate difference between current and gitcommit times
const repo        = args[1]; //Commit Repo
const commit      = args[2]; //Commit SHA
const commitTime  = args[3];//PR time
const currentTime = Date.now();

var leadtime  = diff_hours(commitTime, currentTime);//working 
isRollback(commit,leadtime);//get rollback data then print to log

function diff_hours(dt1, dt2) {
  var diff =(dt2 - dt1);
  var randomGen =Math.floor((Math.random() * 800) + 60);
  var minutesRaw = (diff/60000)+randomGen;//temp random time for testing
  // var minutes = Math.floor(diff / 60000);
  // var seconds = ((diff % 60000) / 1000).toFixed(0);
  //return minutes + ":" + seconds;
  return minutesRaw.toFixed(2); //minutes with 2 decimals
 }

 function isRollback(commit, leadtime){// compare current commit against latest master branch 
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
          console.log("Commit: " +commit+" || Rollback: False || LeadTime: "+diff_hours(dt1, dt2));
    }else{//commit doesn't match latest, must be rollback
         console.log("Commit: " +commit+" || Rollback: True || LeadTime: "+diff_hours(dt1, dt2));
    }
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
 }