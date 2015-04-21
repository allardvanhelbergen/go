'use strict';


/**
 * GET: the home page.
 */
exports.index = function(req, res) {
    res.render('index');
};


/**
 * GET: Return the not found page.
 */
exports.notFound = function(req, res) {
    res.render('not-found');
};


/**
 * GET: the URL to redirect to based on supplied shortUri.
 */
exports.redirect = function(req, res, next) {
    if (!req.goLink) {
        next();
    }

    // TODO(allard): Analytics would go here.
    console.log('Redirecting:', req.goLink);
    res.redirect(req.goLink.longUri);
};
