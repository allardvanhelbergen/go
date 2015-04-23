'use strict';


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

    // TODO(allard): Analytics would go here.
    console.log('Redirecting:', req.goLink);
    res.redirect(req.goLink.longUri);
};
