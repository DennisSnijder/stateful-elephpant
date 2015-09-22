var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Routing
app.use(express.static(__dirname + '/public'));


//All users
var Users = new Array(255);

//App instance @param valid socket
var App = function (socket) {

    //Create instance for refrence in other functions
    var instance = this;

    //Create new user instance for the current socket
    this.Player = {
        x: 250,
        y: 250,
        id: 0,
        name: ""
    };

    //function for initial
    this.sendInital = function (socket) {
        for(var q = 0; q < Users.length; q++) {
            if(Users[q] === undefined) {
                instance.Player.id = q;
                Users[q] = instance.Player;
                console.log('user added');
                io.emit("addPlayer", Users[q]);
                break;
            }
        }

        for(var i = 0; i<Users.length; i++) {
            if(Users[i] != undefined && i != instance.Player.id) {
                socket.emit("addPlayer", Users[i]);
            }
        }

    };

    //send inital data to the socket
    socket.on("register", function(name){
        console.log("New player found!");
        instance.Player.name = name;
        instance.sendInital(socket);
    });

    //Update Player movement
    socket.on("PlayerMove" , function(data) {

        Users[instance.Player.id].x = data[0];
        Users[instance.Player.id].y = data[1];

        io.emit('UpdateUser', {
            x:  data[0],
            y:  data[1],
            id: instance.Player.id
        });

    });


    socket.on("disconnect", function(socket) {
        Users.splice(instance.Player.id, 1);

        io.emit('removePlayer', {
            id: instance.Player.id
        });
    });
};

//listens for new connection on connection create a new instance
io.on("connection", function (socket) {
    new App(socket);
});

server.listen(1337);