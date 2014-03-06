'use strict';

var app    = require('express')(),
    server = require('http').createServer(app),
    io     = require('socket.io').listen(server),
    nano   = require('nano')('http://michiel.io:5984'),
    port   = parseInt(process.env.PORT) || 3000, // We need to use parseInt because all environment variables are strings ~ Gilles
    uuid = require('node-uuid');

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
  nano.use('sysinfo').insert(sysinfo, sysinfo.uuid, function (err, body, header) {
    if (err) {
      console.error('Error saving document:', err);
      return;
    }
    console.log('Saved system information', sysinfo.uuid);
  });
}

module.init();