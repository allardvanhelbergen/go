'use strict';


var config = require('../config');
var mongoose = require('mongoose');
var winston = require('winston');


module.exports.connect = function() {
    var db;
    var dbUrl = 'mongodb://' + config.mongo.HOSTNAME + '/' + config.mongo.DATABASE + '?auto_reconnect';

    mongoose.connect(dbUrl);
    db = mongoose.connection;

    db.on('error', function(err) {
        winston.error('Database connection error:', err);
        return err;
    });

    db.once('open', function() {
        winston.info('Database connection successful at:', dbUrl);
    });
};
