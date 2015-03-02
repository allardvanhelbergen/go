'use strict';


/**
 * GET: the home page.
 */
exports.index = function(req, res) {
    res.render('index', {user: {firstName: req.user.name.givenName, picture: req.user._json.picture}});
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
exports.redirect = function(req, res) {
    console.log('Redirecting:', req.goLink);
    if (!req.goLink) {
        return;
    }
    // TODO(allard): Analytics would go here.
    res.redirect(req.goLink.longUri);
};
