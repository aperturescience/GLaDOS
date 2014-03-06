'use strict';

var app    = require('express')(),
    util   = require('util'),
    server = require('http').createServer(app),
    io     = require('socket.io').listen(server),
    port   = parseInt(process.env.PORT) || 3000, // We need to use parseInt because all environment variables are strings ~ Gilles
    redis  = require('redis');


var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_SERVER);

module.init = function () {
  module.startWebServer();
  module.startSocketServer();
};

module.startWebServer = function () {

  server.listen(port);
  console.log('Express is listening on port', port);

  app.get('/', function (req, res) {
    res.send({
      greeting: 'Hello human, shall I flood your home with a deadly neurotoxin?'
    });
  });

};

module.startSocketServer = function () {

  console.log('Socket.IO is listening for connections on port', port);

  io.sockets.on('connection', function (socket) {

    socket.emit('greeting', { hello: 'human' });

    socket.on('wheatley.sysinfo', function (sysinfo) {
      sysinfo.inet = remoteAddress(socket);
      logSytemInfo(sysinfo);
    });

  });

};

// check if client is behind a proxy
function remoteAddress(socket) {
  return socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
}

function logSytemInfo(sysinfo) {

  console.log(util.inspect(sysinfo, { depth: null }));

  redisClient.HMSET(sysinfo.uuid, sysinfo, function () {
    console.log('Saved system information for', sysinfo.uuid);
  });

}

redisClient.on('error', function (err) {
  console.error('[redisclient]:', err);
});

redisClient.auth(process.env.REDIS_PASS, function success() {
  console.log('[redisclient]: Successfully connected');
  module.init();
});