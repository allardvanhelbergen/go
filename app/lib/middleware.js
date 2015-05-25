/**
 * Library containing all supplemental middleware functions.
 */

'use strict';


var winston = require('winston');
var config = require('../../config');
var GoLinkModel = require('../models/goLinkModel');


/**
 * Copy Config variables into res.locals for use throughout the app.
 */
exports.putConfigInLocals = function(req, res, next) {
    res.locals.config = {};
    res.locals.config.app = config.app;
    res.locals.flash = req.flash();
    return next();
};


/**
 * Ensure the request is authenticated. If not, redirect to authentication.
 */
exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/_auth/google');
};


/**
 * Parse the short URI parameter from the request URL.
 */
exports.parseParam = function(req, res, next, shortUri) {
    winston.info('Matching shortUri: ' + shortUri);
    GoLinkModel.find({shortUri: shortUri}, function(err, docs) {
        if (err) {
            return next(err);
        }

        if (docs[0]) {
            req.goLink = docs[0];
        }

        return next();
    });
};


/**
 * Look in urlencoded POST bodies, extract the method var and delete it from the body.
 * @param  {Object} req The Request
 * @param  {Object} res The Response
 * @return {String}     The method variable extracted from the POST body
 */
exports.parseRequestMethodValue = function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;

        delete req.body._method;
        return method;
    }
};
