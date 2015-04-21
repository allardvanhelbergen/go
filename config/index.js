'use strict';


var _ = require('lodash');


// Load partial configs.
var globalConfig = require('./global.json');
var envConfig = require('./' + (process.env.NODE_ENV || 'development') + '.json');

// Combine the partial configs.
var config = _.merge(globalConfig, envConfig);


module.exports = config;
