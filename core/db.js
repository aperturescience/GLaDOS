'use strict';

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