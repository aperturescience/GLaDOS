'use strict';

var port = process.env.PORT ||80;

var io = require('socket.io').listen(port);

io.sockets.on('connection', function (socket) {
  socket.emit('greeting', { 'greeting': 'hello wheatley' });
  socket.on('event', function (data) {
    console.log(data);
  });
});