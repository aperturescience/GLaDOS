var app    = require('express')(),
    server = require('http').createServer(app),
    io     = require('socket.io').listen(server),
    port   = parseInt(process.env.PORT) || 3000, // We need to use parseInt because all environment variables are strings ~ Gilles
    redis  = require("redis"),
    redisClient = redis.createClient(19109, 'pub-redis-19109.us-central1-1-1.gce.garantiadata.com');

redisClient.auth(process.env.REDISPASSWD, function success() {
  console.log('Successfully connected');

  startExpress();
  startSocketIO();
});

/* In case of redis errors */
redisClient.on("error", function (err) {
  console.log("Error " + err);
});

function startExpress() {
  server.listen(port);
  console.log('Express is listening on port', port);

  app.get('/', function (req, res) {
    res.send({
      greeting: 'Hello human, shall I flood your home with a deadly neurotoxin?'
    });
  });
}

function startSocketIO() {
  console.log('Socket.IO is listening for connections on port', port);

  io.sockets.on('connection', function (socket) {
    socket.emit('greeting', { hello: 'human' });

    socket.on('wheatley.sysinfo', function (sysinfo) {
      console.log(sysinfo);
    });
  });

}