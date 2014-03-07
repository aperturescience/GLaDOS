'use strict';

var app         = require('express')(),
    config      = require('./config/settings.json'),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    nano        = require('nano')(config.db.url + ':' + config.db.port),
    // We need to use parseInt because all environment variables are strings
    port        = parseInt(process.env.PORT) || 3000;

exports.init = function () {
  exports.startWebServer();
  exports.startDatabase();
  exports.startSocketServer();
};

exports.startWebServer = function () {

  server.listen(port);
  console.log('Express is listening on port', port);

  app.get('/', function (req, res) {
    res.send({
      greeting: 'Hello human, shall I flood your home with a deadly neurotoxin?'
    });
  });

};

exports.startSocketServer = function () {

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

exports.startDatabase = function () {
  nano.relax(function (err, body, header) {
    if (err) {
      console.error(err);
      process.exit();
    }
    console.log('[db]: connected to couchDB v' + body.version);
  });
};

function logSytemInfo(sysinfo) {

  var sysinfoDb = nano.use('sysinfo');

  sysinfoDb.get(sysinfo.uuid, function (err, body, header) {

    if (err) return; // silently fail

    sysinfo._rev = body._rev;

    sysinfoDb.insert(sysinfo, body.uuid, function (err, body, header) {

      if (err) {
        console.error('Error saving document:', err);
        return;
      }

      console.log('Saved system information', sysinfo.uuid);

    });
  });

}

exports.init();