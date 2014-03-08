'use strict';

var spawn = require('child_process').spawn;

exports.setup = function () {
  require('../db/setup').seed();
};

exports.insert = function (db, uuid, data) {

  db.get(uuid, function (err, body, header) {

    if (!err && body)
      data._rev = body._rev;

    db.insert(data, uuid, function (err, body, header) {
      if (err) {
        console.error('Error saving document:', err);
        return;
      }
      console.log('Saved system information', uuid);
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

  couch.stdout.on('data', function (data) {
    console.log('[couchdb]: ' + data);
  });

  couch.stderr.on('data', function (data) {
    console.log('[couchdb]: ' + data);
  });

  couch.on('close', function (code) {
    console.log('couchdb exited with code ' + code);
  });

};