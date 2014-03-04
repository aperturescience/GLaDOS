var app    = require('express')(),
    server = require('http').createServer(app),
    io     = require('socket.io').listen(server),
    port   = parseInt(process.env.PORT) || 3000, // We need to use parseInt because all environment variables are strings ~ Gilles
    redis  = require("redis"),
    redisClient = redis.createClient(19109, process.env.REDIS_SERVER);

redisClient.auth(process.env.REDIS_PASS, function success() {
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

      redisClient.HMSET(sysinfo.uuid, sysinfo, function() {
        console.log('Saved system information for', sysinfo.uuid);
      });
    });
  });

}
