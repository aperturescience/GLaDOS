var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.emit('greeting', { 'greeting': 'hello wheatley' });
  socket.on('event', function (data) {
    console.log(data);
  });
});