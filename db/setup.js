'use strict';

var nano      = require('nano')('http://michiel.io:5984');

exports.start = function () {
  exports.seed();
};

exports.seed = function () {

  var reqDatabases = [
    'sysinfo',
  ];

  for (var dbname in reqDatabases) {
    nano.db.create(dbname, returnHandler);
  }

  function returnHandler(err, body) {
    if (err) return; // silently fail
    console.log('Created database', body, '...');
  }

};