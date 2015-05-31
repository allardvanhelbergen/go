'use strict';

var util = require('util');
var winston = require('winston');

var GoLinkModel = require('../models/goLinkModel');
var RedirectLogModel = require('../models/redirectLogModel');


/**
 * GET: the home page.
 */
exports.index = function(req, res, next) {
    GoLinkModel.find()
        .sort({shortUri: 1})
        .populate('ownerId')
        .exec(function(err, goLinks) {
            if (err) {
                return next(err);
            }

            res.render('index', {goLinks: goLinks});
        });
};


/**
 * GET: the URL to redirect to based on supplied shortUri.
 */
exports.redirect = function(req, res, next) {
    if (!req.goLink) {
        return next();
    }

    // Update Redirect Log
    new RedirectLogModel({
        goLinkId: req.goLink._id
    }).save(function(err, doc) {
        if (err) {
            // TODO(allard): DB errors
            // Do not return next() here, as this callback will resolve at later point in time.
            winston.error('Error saving to redirect logs.', util.inspect(err));
        }

        winston.info('Updated redirect log.', util.inspect(doc));
    });

    // Redirect
    winston.info('Redirecting:', util.inspect(req.goLink));
    res.redirect(req.goLink.longUri);
};
