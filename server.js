'use strict';

var app         = require('express')(),
    config      = require('./config/settings.json'),
    logger      = require('./config/winston'),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    nano        = require('nano')(config.db.url + ':' + config.db.port),
    db          = require('./core/db.js'),
    // We need to use parseInt because all environment variables are strings
    port        = parseInt(process.env.PORT) || 3000;

exports.init = function () {
  exports.startWebServer();
  exports.startDatabase();
  exports.startSocketServer();
};

exports.startWebServer = function () {

  server.listen(port);
  logger.log('Express is listening on port', port);

  app.get('/', function (req, res) {
    res.send({
      greeting: 'Hello human, shall I flood your home with a deadly neurotoxin?'
    });
  });

};

exports.startSocketServer = function () {

  logger.log('Socket.IO is listening for connections on port', port);

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
  db.ping(nano, function online(body, header) {

    logger.log('[db]: connected to couchDB v' + body.version);

  }, function offline(err) {

    db.boot();

  });
};

function logSytemInfo(sysinfo) {
  var dbname = nano.use('sysinfo');
  db.insert(dbname, sysinfo.uuid, sysinfo);
}

exports.init();