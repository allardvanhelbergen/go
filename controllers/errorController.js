/**
 * The controller to handle all unhandled errors from middleware as well as
 * the collection of function to handle those errors.
 */

'use strict';


var winston = require('winston');


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
exports.renderRouteNotFound = function(req, res) {
    res.status(404).render('404', {path: req.path});
};
