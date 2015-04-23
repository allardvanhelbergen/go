/**
 * Library containing all supplemental middleware functions.
 */


'use strict';

var config = require('../config');
var GoLinkModel = require('../models/goLinkModel');


/**
 * Copy Config variables into res.locals for use throughout the app.
 */
exports.putConfigInLocals = function(req, res, next) {
    res.locals.config = {};
    res.locals.config.app = config.app;
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
  console.error(err.stack);
  res.status(500).send('Something broke!');
  return next();
};

/**
 * GET: render the not found page.
 */
exports.renderRouteNotFound = function(req, res, next) {
    res.status(404).render('not-found');
    return next();
};


/**
 * Parse the short URI parameter from the request URL.
 */
exports.parseParam = function(req, res, next, shortUri) {
    console.log('Matching shortUri: ' + shortUri);
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



