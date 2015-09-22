var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);



// Routing
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
});

server.listen(1337);