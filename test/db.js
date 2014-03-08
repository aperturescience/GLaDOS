'use strict';

var assert      = require('assert'),
    setup       = require('../db/setup.js'),
    _           = require('lodash-node'),
    seed        = require('../db/seed.json');

describe('database', function () {
  describe('#setup()', function () {
    it('should create all required databases in couchdb', function (done) {

      setup.seed(function complete(dbs) {
        var intersect = _.intersection(dbs, seed.databases);
        done(assert.deepEqual(intersect, seed.databases));
      });

    });
  });
});