'use strict';


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
    res.json(req.goLink);
};


/**
 * POST: Create a submitted Go link.
 */
exports.create = function(req, res, next) {
    if (!req.body || !req.body.longUri || !req.body.shortUri) {
        return next(new Error('No URL data provided.'));
    }

    // TODO(allard): Add the owner ID after we've figured authentication out.
    GoLinkModel.create({
        longUri: req.body.longUri,
        shortUri: req.body.shortUri,
        ownerEmail: req.user._json.email
        // owner: user._id
    }, function(err, link) {
        if (err) {
            return next(err);
        }

        console.info('Added goLink %j', link);
        res.redirect('/');
    });
};
