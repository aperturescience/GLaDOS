var winston = require('winston');

/**
 * Custom logger
 */
module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      prettyPrint: true,
      json: false,
      handleExceptions: true
    }),
    new winston.transports.File({
      colorize: true,
      timestamp: true,
      handleExceptions: true,
      filename: 'glados.log'
    })
  ]
});