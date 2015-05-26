'use strict';


var config = require('../../config');
var mongoose = require('mongoose');
var winston = require('winston');


module.exports.connect = function() {
    var connected = false;
    var db;
    var DB_URL = 'mongodb://' + config.mongo.HOSTNAME + '/' + config.mongo.DATABASE + '?auto_reconnect';

    mongoose.connect(DB_URL);
    db = mongoose.connection;


    // TODO(allard): This can probably do with some smartening up.
    db.on('close', function(ref) {
        connected = false;
        winston.error('Database connection closed.');
    });

    db.on('connected', function(ref) {
        connected = true;
        winston.info('Database connection connected.');
    });

    db.on('disconnected', function(ref) {
        connected = false;
        winston.log('Database connection disconnected.');
    });

    db.on('error', function(err) {
        connected = false;
        winston.error('Database connection error.');
        winston.error(err);
        throw err;
    });

    db.on('open', function(ref) {
        connected = true;
        winston.info('Database connection successful at:', DB_URL);
    });

    db.on('reconnect', function(ref) {
        connected = true;
        winston.info('Database connection reconnect.');
    });
};
