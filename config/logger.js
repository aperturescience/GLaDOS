var turret = require('turret');

/**
 * Custom logger
 */
module.exports = new (turret.Logger)({
  transports: [
    new (turret.transports.Console)({
      colorize: true,
      prettyPrint: true,
      json: false,
      handleExceptions: true,
      level: 'silly',
      format: '%m'
    }),
    new turret.transports.File({
      colorize: true,
      timestamp: true,
      handleExceptions: true,
      filename: 'glados.log'
    })
  ]
});
