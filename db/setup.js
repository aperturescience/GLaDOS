'use strict';

var config      = require('../config/settings.json'),
    logger      = require('../config/logger'),
    seed        = require('./seed.json'),
    nano        = require('nano')(config.db.url + ':' + config.db.port);

exports.seed = function (callback) {

  var dbs = seed.databases;

  dbs.forEach(function (db) {
    nano.db.create(db, function (err, body) {
      if (err) return; // silently fail
      logger.log('Created database', db, '...');
    });
  });

  if (typeof callback === 'function') {
    nano.db.list(function (err, body) {
      callback(body);
    });
  }

};

exports.seed();