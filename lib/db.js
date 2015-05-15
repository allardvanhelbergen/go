'use strict';


var mongoose = require('mongoose');
var winston = require('winston');


module.exports.connect = function(dbURL) {
    var db;

    mongoose.connect(dbURL);
    db = mongoose.connection;

    db.on('error', function(err) {
        winston.error('Database connection error:', err);
        return err;
    });

    db.once('open', function() {
        winston.info('Database connection successful at:', dbURL);
    });
};
