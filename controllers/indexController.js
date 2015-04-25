'use strict';


var RedirectLogModel = require('../models/redirectLogModel');

/**
 * GET: the home page.
 */
exports.index = function(req, res) {
    res.render('index');
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
            // Do not return next() here, as this callback will resolve at later point in time.
            console.error(err);
        }

        console.log('Updated Redirect Log', doc);
    });

    // Redirect
    console.log('Redirecting:', req.goLink);
    res.redirect(req.goLink.longUri);
};
