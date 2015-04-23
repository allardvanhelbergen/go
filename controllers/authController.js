'use strict';


/**
 * GET: the callback after authentication.
 */
exports.logInSuccess = function(req, res) {
    res.redirect('/');
};


/**
 * GET: Redirect on to / on log out success.
 */
exports.logOutSuccess = function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};
