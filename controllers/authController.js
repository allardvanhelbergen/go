'use strict';


/**
 * GET: the callback after authentication.
 */
exports.logInSuccess = function(req, res) {
    req.flash('success', 'Log in successful.');
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
