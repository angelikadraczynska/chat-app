const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname + '/client')));

app.use((req, res, next) => {
  res.show = name => {
    res.sendFile(path.join(__dirname + `/client/${name}`));
  };
  next();
});

app.get('/', function(req, res) {
  res.show('index.html');
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000);
});

const io = socket(server);

io.on('connection', socket => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('join', user => {
    newUser = { id: socket.id, user: user };
    users.push(newUser);
    socket.broadcast.emit('join', user);
  });

  socket.on('message', message => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
    users.map(activeUser => {
      if (activeUser.id === socket.id) {
        const index = users.indexOf(activeUser);
        users.splice(activeUser.id, index);
        socket.broadcast.emit('leave', activeUser.user);
      }
    });
  });
  console.log("I've added a listener on message and disconnect events \n");
});
