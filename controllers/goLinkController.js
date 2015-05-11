'use strict';

var util = require('util');
var winston = require('winston');
var GoLinkModel = require('../models/goLinkModel');


/**
 * GET: Show JSON for all Go Links.
 */
exports.findAll = function(req, res) {
    GoLinkModel.find({}, function(err, docs) {
        res.json(docs);
    });
};


/**
 * GET: Show JSON for Go Link matching a shorturi.
 */
exports.findByShortUri = function(req, res) {
    if (!req.goLink) {
        res.status(404).json({'404': 'go-link not found.'});
    }

    res.json(req.goLink);
};


/**
 * POST: Create a submitted Go link.
 */
exports.create = function(req, res, next) {
    if (!req.body || !req.body.longUri || !req.body.shortUri) {
        return next(new Error('No URL data provided.'));
    }

    GoLinkModel.create({
        longUri: req.body.longUri,
        shortUri: req.body.shortUri,
        ownerId: req.bwUser._id
    }, function(err, link) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {  // Duplicate Key error
                winston.info('Did not add duplicate goLink', util.inspect(req.body.shortUri));
                req.flash(
                    'error',
                    'Our Space Administration indicates <a class="alert-link" href="%s">go/%s</a> is already taken. ' +
                            'Please try another.',
                    req.body.shortUri,
                    req.body.shortUri);
                return res.redirect('/');
            } else {
                return next(err);
            }
        }

        winston.info('Added goLink', util.inspect(link));
        req.flash(
            'success',
            '3... 2... 1... 0... We have ignition! We have liftoff!!!&nbsp;&nbsp;' +
                    '<a class="alert-link" href="%s">go/%s</a>',
            req.body.shortUri,
            req.body.shortUri);
        res.redirect('/');
    });
};
