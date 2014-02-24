var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , port = parseInt(process.env.PORT) || 3000; // we need to use parseInt because all environment variables are strings ~ Gilles

server.listen(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('greeting', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});