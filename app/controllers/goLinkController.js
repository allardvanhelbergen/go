/**
 * The controller for handling go links.
 */

'use strict';


var config = require('../../config');
var util = require('util');
var winston = require('winston');
var GoLinkModel = require('../models/goLinkModel');


/**
 * GET: Show JSON for all Go Links.
 */
exports.findAll = function(req, res) {
    GoLinkModel.find({}, function(err, docs) {
        if (err) {
            // TODO(allard): DB errors
            return res.status(422).json({'422': 'Error loading the go links.', message: err.message});
        }

        if (req.params.format === 'json') {
            return res.json(docs);
        } else {
            return res.render('go-link/index', {goLinks: docs});
        }
    });
};


/**
 * GET: Show JSON for Go Link matching a shorturi.
 */
exports.findByShortUri = function(req, res) {
    if (!req.goLink) {
        return res.status(404).json({'404': 'go-link not found.'});
    }

    return res.json(req.goLink);
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
            // TODO(allard): DB errors
            if (err.name === 'MongoError' && err.code === 11000) {  // Duplicate Key error
                winston.info('Did not add duplicate goLink', util.inspect(req.body.shortUri));
                req.flash(
                    'error',
                    'Space Administration indicates <a class="alert-link" href="%s/%s">go/%s</a> is already taken. ' +
                            'Please try another.',
                    config.app.BASE_HREF,
                    req.body.shortUri,
                    req.body.shortUri);
                return res.redirect('/');
            } else {
                return next(err);
            }
        }

        winston.info('Added goLink', link.shortUri, link.longUri);
        winston.debug(util.inspect(link));
        req.flash(
            'success',
            '3... 2... 1... 0... We have ignition! We have lift off!!!&nbsp;&nbsp;' +
                    '<a class="alert-link" href="%s/%s">go/%s</a>',
            config.app.BASE_HREF,
            req.body.shortUri,
            req.body.shortUri);
        return res.redirect('/');
    });
};


exports.read = function(req, res) {
    var id = req.params.id;

    GoLinkModel.findById(id, function(err, docs) {
        if (err) {
            // TODO(allard): DB errors
            return res.status(422).json({'422': 'Error loading the go link.', message: err.message});
        }

        // TODO(allard): This needs to be handled in a central place.
        if (!docs) {
            return res.status(404).json({'404': 'Go link not found.'});
        }

        if (req.params.format === 'json') {
            return res.json(docs);
        } else {
            return res.render('go-link/show-go-link', {goLink: docs});
        }
    });
};


exports.updateTest = function(req, res, next) {
    req.flash('success', '<strong>OMG!</strong> That was a PUT request!');
    return res.redirect('/_admin/edit-test');
};
