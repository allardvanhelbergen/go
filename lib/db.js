'use strict';


var mongoose = require('mongoose');
var winston = require('winston');


module.exports.connect = function(dbURL) {
    mongoose.connect(dbURL);

    var db = mongoose.connection;

    db.on('error', function(err) {
        winston.error('Database connection error:', err);
    });

    db.once('open', function() {
        winston.info('Database connection successful at:', dbURL);
    });
};
