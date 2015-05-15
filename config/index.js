'use strict';


var _ = require('lodash');


// Load partial configs.
var globalConfig = require('./global.json');
var envConfig = require('./' + (process.env.NODE_ENV || 'development') + '.json');

// Combine the partial configs.
var config = _.merge(globalConfig, envConfig);

// Overwrite defaults with ENV variables if they are present.
config.http.ENV = process.env.NODE_ENV || config.http.ENV;
config.http.PORT = process.env.NODE_PORT || config.http.PORT;
config.mongo.DATABASE = process.env.MONGO_DATABASE || config.mongo.DATABASE;
config.mongo.HOSTNAME = process.env.MONGO_HOSTNAME || config.mongo.HOSTNAME;
config.passport.CLIENTID = process.env.PASSPORT_CLIENTID || config.passport.CLIENTID;
config.passport.CLIENTSECRET = process.env.PASSPORT_CLIENTSECRET || config.passport.CLIENTSECRET;
config.session.SECRET = process.env.SESSION_SECRET || config.session.SECRET;

module.exports = config;
