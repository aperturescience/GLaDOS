'use strict';

var spawn     = require('child_process').spawn;

exports.setup = function () {
  require('../db/setup').start();
};

exports.insert = function (db, uuid, data) {

  db.get(uuid, function (err, body, header) {

    if (!err && body) {
      data._rev = body._rev;
    }

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
    if (err) {
      fail(err);
    } else {
      success(body, header);
    }
  });
};

exports.boot = function () {
  spawn('couchdb');
};