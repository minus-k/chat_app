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

var messages = [];
var store_message = function(name, data) {
  messages.push({name: name, data: data});
  if (messages.length > 15) {
    messages.shift();
  }
}

io.sockets.on('connection', function(client) {


  client.on('join', function(name) {
    client.set('nickname', name);
    client.broadcast.emit('chat', name + ' has joined the chat');
    messages.forEach(function(message) {
      client.emit('messages', message.name + ': ' + message.data);
    });
  });

  client.on('messages', function(message) {
    client.get('nickname', function(error, name) {
      store_message(name, message);
      client.broadcast.emit("messages", name + ": " + message);
    });
  });

  client.on('disconnect', function() {
    client.get('nickname', function(error, name) {
      client.broadcast.emit('left', name + ' has left the chat');
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
});
