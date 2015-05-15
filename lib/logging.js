'use strict';

var winston = require('winston');
var LogStream = require('logfilestream').LogStream;
var config = require('../config');
var path = require('path');

winston.remove(winston.transports.Console);

function init() {
    var loggingDir;

    switch (App.app.ENV) {
        case 'production':
            loggingDir = path.resolve(__dirname, config.logging.DIR);
            console.log('Enabling logging to ', loggingDir);
            winston.add(winston.transports.File, {
                stream: new LogStream({
                    logdir: loggingDir,
                    nameformat: '[go.]YYYY-MM-DD[.log]',
                    duration: 1000 * 60 * 60 * 24  // Rotate every 24 hours.
                }),
                handleExceptions: true,
                exitOnError: false,
                colorize: false,
                timestamp: true,
                json: false,
                level: 'info'
            });
            break;
        case 'development':
            winston.add(winston.transports.Console, {
                colorize: true,
                timestamp: false,
                level: 'debug'
            });
            break;
    }

}

module.exports = {
    init: init
};
