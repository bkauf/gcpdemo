$(document).ready( function() {
  $(".health").click(function(e){
    $.get("/health", function(data, status){
        $('#status').text('Health:'+data);
      });
          //alert("Data: " + data + "\nStatus: " + status);
    });
  $(".kill").click(function(e){
    $.get("/kill", function(data, status){
      $('#status').text('Health:'+data);
          //  alert("Data: " + data + "\nStatus: " + status);
        });
  });

  $("#send-button").click(function(e){//for pubsub
  var pubsubMessage = $('#pubsubMessage').val();
  var topicName     = $('#topicName').val();
  var topicToken    = $('#topicToken').val();
  $.post('/sendpubsub',{ 'topicName':topicName,
   'topicToken':topicToken, 'pubsubMessage':pubsubMessage },function(data, status, jqXHR)
        {// success callback
                $('#status').text('Status: '+status+', data: '+data);
        });
  });

  $("#chat-button").click(function(e){//for dialogflow
    var dialogToken = $('#dialogToken').val();
    var chatToken   = $('#chatToken').val();
    var userMessage = $('#userMessage').val();
    var userSession = $('#userSession').val();
    var dialog      = $('#action').html();


    $('#action').html("user: "+userMessage+"<BR>"+dialog);//add user message to dialog
    $('#userMessage').val(""); //clear user message box

    if (userMessage!=""){
      $.post('/sendChat',{ userMessage:userMessage, dialogToken:dialogToken, chatToken:chatToken, userSession:userSession},function(data, status, jqXHR)
          {// success callback
            console.log(data);
          var resOjb= JSON.parse(data);
                  var dialog = $('#action').html();
                  $('#action').html("<span class='blue'>Agent: "+resOjb.result.fulfillment.speech+"</span><BR>"+dialog);
          });
      }
  });
});
