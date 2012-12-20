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
var chatters = [];
var store_message = function(name, data) {
  messages.push({name: name, data: data});
  if (messages.length > 15) {
    messages.shift();
  }
}

var store_person = function(name) {
  chatters.push({name: name});
}

var remove_person = function(name) {
  var index = chatters.indexOf(name);
  chatters.splice(index, 1);
}

io.sockets.on('connection', function(client) {

  client.on('join', function(name) {
    client.set('nickname', name);
    store_person(name);
    chatters.forEach(function(chatter) {
      client.emit('entered', chatter.name);
    });
    client.broadcast.emit('entered', name);
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
      remove_person(name);
      chatters.forEach(function(chatter) {
        client.broadcast.emit('left', chatter.name);
      });
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
});
