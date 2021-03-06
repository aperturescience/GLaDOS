'use strict';

var spawn   = require('child_process').spawn,
    logger  = require('../config/logger');

exports.setup = function () {
  require('../db/setup').seed();
};

exports.insert = function (db, uuid, data) {

  db.get(uuid, function (err, body, header) {

    if (!err && body)
      data._rev = body._rev;

    db.insert(data, uuid, function (err, body, header) {
      if (err) {
        logger.error('Error saving document:', err);
        return;
      }
      logger.log('Saved system information', uuid);
    });

  });
};

exports.ping = function (instance, success, fail) {
  instance.relax(function (err, body, header) {
    if (err)
      fail(err);
    else
      success(body, header);
  });
};

exports.boot = function () {

  var couch = spawn('couchdb');

  couch.on('error', function (err) {
    if (err.message.indexOf('ENOENT') !== -1) {
      logger.error('[couchdb]: Could not find the couchdb executable.');
      process.exit(1);
    }
    else
      throw err;
  });

  couch.stdout.on('data', function (data) {
    logger.log('verbose', '[couchdb]: ' + data);
  });

  couch.stderr.on('data', function (data) {
    logger.error('[couchdb]: ' + data);
  });

  couch.on('close', function (code) {
    logger.log('verbose', 'couchdb exited with code ' + code);
  });

};
