var execSync = require("exec-sync");

var webSocketServerPort = 1337;
var WebSocketServer = require('websocket').server;
var http = require('http');

var clients = [ ]; // needed to collect connected clients
var portIds = {red: 0, yellow: 1, green: 2};

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});

server.listen(webSocketServerPort, function() {
console.log((new Date()) + " Server is listening on port " + webSocketServerPort);
 });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {

    var requestOrigin = request.origin;

console.log( (new Date()) + ' Connection from origin ' + request.origin);

    var connection = request.accept(null, requestOrigin);
    // index needed for more than one client
    var index = clients.push(connection) - 1;

console.log((new Date()) + ' Connection accepted... ');
    var data = {};
    var cmd = "gpio read ";
    for (var id in portIds) {
      var r = !!parseInt(execSync(cmd + portIds[id])) ;
      data[id] = r;
     }

   var result = {type : 'status', data: data };
console.log(result);
   
    connection.send(JSON.stringify(result));
 
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    // message object looks like: { type: 'utf8', utf8Data: 'green' } 
    connection.on('message', function(message) {
console.dir(message);    
        if (message.type === 'utf8') {

            var jsonParsed = JSON.parse(message.utf8Data);
            var res = {type: 'status', data : jsonParsed};
            var json = JSON.stringify(res);
for (var led in jsonParsed) {


var command = "gpio write " + portIds[led] + " "+ ((jsonParsed[led]) ? 1 : 0);
var stat = execSync(command);
}
var video = execSync('uvccapture -m -o/usr/share/nginx/www/snap.jpg ');
//var video = execSync('uvccapture -m');
var json2 = JSON.stringify({type: 'webcam', data: ''});

            for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                    clients[i].sendUTF(json2);
             }

         }
    });

    connection.on('close', function(connection) {
        // close user connection
console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
     });

});
