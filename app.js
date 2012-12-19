var express = require('express');
var socket = require('socket.io');
var app = express.createServer();
var io = socket.listen(app);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});


app.get('/', function(request, response) {
  response.sendfile(__dirname + "/index.html");
});

io.sockets.on('connection', function(client) {
  client.on('join', function(name) {
    client.set('nickname', name);
  });

  client.on('messages', function(message) {
    client.get('nickname', function(error, name) {
      client.broadcast.emit("messages", name + ": " + message);
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
});
