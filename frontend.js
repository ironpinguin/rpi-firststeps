
$(document).ready(startUp);

var ledStatus = {
  red: false,
  yellow: false,
  green: false
};

function startUp() {
  "use strict";
  var greenLed = $("#green");
  var redLed = $("#red");
  var yellowLed = $("#yellow");
  var error = $("#error");

  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;


  // if browser doesn't support WebSocket, just show some notification and exit
  if (!window.WebSocket) {
    content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                + 'support WebSockets.'} ));
    return;
  }
  
  var connection = new WebSocket("ws://172.19.0.162:1337");

  connection.onopen = function () {
    // first we want users to enter their names
  };

  connection.onerror = function (error) {
    // just in there were some problems with conenction...
    error.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                + 'connection or the server is down.</p>' } ));
  };

  // most important part - incoming messages
  connection.onmessage = function (message) {
    // try to parse JSON message. Because we know that the server always returns
    // JSON this should work without any problem but we should make sure that
    // the massage is not chunked or otherwise damaged.
    try {
        var json = JSON.parse(message.data);
    } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
    }

    // NOTE: if you're not sure about the JSON structure
    // check the server source code above
    if (json.type === 'status') { // first response from the server with user's color
      var stats = json.data;
      console.log(stats);
      for (var led in stats) {
        console.log(led+" STAT "+stats[led]);
        ledStatus[led] = stats[led];
        setSvgColor(led, stats[led]);
      }
    } else if (json.type === 'webcam') { // update webcam image
      var date = new Date().getTime();
      document.images['webcam'].src = 'snap.jpg?v=' + date;
    } else {
      console.log('Hmm..., I\'ve never seen JSON like this: ', json);
    }
  };
  redLed.click(function(event) {
    console.log("Click Red");
    socketSend(connection, "red");
   }); 
   yellowLed.click(function(event) {
     console.log("Click Yellow");
     socketSend(connection, "yellow");
   }); 
   greenLed.click(function(event) {
     console.log("Click Green");
     socketSend(connection, "green");
   }); 
}

function socketSend(conn, led) {
  var led;
  var message = new Object();
  var statInvert = (!ledStatus[led]);
  console.log("Set "+led+" to "+statInvert);
  message[led] = statInvert;
  message = JSON.stringify(message);
  try {
    conn.send(message);
    setSvgColor(led, statInvert);
    ledStatus[led] = statInvert;
  } catch(exception) {
    console.log("failed send led switch! "+exception);
  }
};

function setSvgColor(field, stat) {
  var color = (stat) ? field : "white";
  $("#"+field)
    .children("circle")
    .attr("fill", color);
};
