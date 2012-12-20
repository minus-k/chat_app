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


app.get('/style.css', function(request, response) {
  response.sendfile(__dirname + "/style.css");
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
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
});
