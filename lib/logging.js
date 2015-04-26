'use strict';

var winston = require('winston');
var LogStream = require('logfilestream').LogStream;
var config = require('../config');
var path = require('path');
var NODE_ENV = (process.env.NODE_ENV || '').toLowerCase();

winston.remove(winston.transports.Console);

function init() {
    var loggingDir;

    switch (NODE_ENV) {
    case 'production':
        loggingDir = path.resolve(__dirname, config.logging.DIR);
        console.log('Enabling logging to ', loggingDir);
        winston.add(winston.transports.File, {
            stream: new LogStream({
                logdir: loggingDir,
                nameformat: '[brandwatch.]YYYY-MM-DD[.log]',
                duration: 1000 * 60 * 60 * 24 // rotate every 24 hours
            }),
            handleExceptions: true,
            exitOnError: false,
            colorize: false,
            timestamp: true,
            json: false,
            level: 'info'
        });
        break;
    default:
        winston.add(winston.transports.Console, {
            colorize: true,
            timestamp: false,
            level: 'debug'
        });
        winston.info('NODE_ENV', NODE_ENV);
        break;
    }

}

module.exports = {
    init: init
};
