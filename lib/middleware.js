/**
 * Library containing all supplemental middleware functions.
 */


'use strict';


var winston = require('winston');
var config = require('../config');
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

    res.redirect('/auth/google');
};


/**
 * Render a system error.
 */
exports.renderError = function(err, req, res, next) {
    winston.error(err);
    res.status(500).render('500', {error: err.message});
};


/**
 * GET: render the not found page.
 */
exports.renderRouteNotFound = function(req, res, next) {
    res.status(404).render('404', {path: req.path});
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



