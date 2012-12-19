var express = require('express');
// var app = express();
var app = express.createServer(express.logger());

var io = require('socket.io').listen(app);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

app.get('/', function(request, response) {
  io.sockets.on('connection', function() {
    console.log('Client connected');
  });
});

// var http = require('http');
// var express = require('express');
// var app = express();
// app = http.createServer(app);
