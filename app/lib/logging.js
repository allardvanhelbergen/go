'use strict';


var fs = require('fs');
var LogStream = require('logfilestream').LogStream;
var path = require('path');
var winston = require('winston');

var config = require('../../config');


winston.remove(winston.transports.Console);


exports.init = function() {
    var logDir;

    if (config.http.ENV === 'production') {
        logDir = path.resolve(__dirname, config.logging.DIR);

        // Create the logfile directory
        try {
            fs.mkdirSync(logDir);
            console.info('Created logging directory');
        } catch (e) {
            if (e.code !== 'EEXIST') {
                throw new Error(e);  // Ignore the error if the folder already exists.
            }
        }

        console.info('Enabling logging to', logDir);
        winston.add(winston.transports.File, {
            stream: new LogStream({
                logdir: logDir,
                nameformat: '[go.]YYYY-MM-DD[.log]',
                duration: 1000 * 60 * 60 * 24  // Rotate every 24 hours.
            }),
            colorize: false,
            exitOnError: false,
            handleExceptions: true,
            json: false,
            level: 'info',
            prettyprint: true,
            timestamp: true,
        });
    } else {
        winston.add(winston.transports.Console, {
            colorize: true,
            level: 'silly',
            prettyprint: true
        });
    }
};
