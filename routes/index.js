'use strict';


var config = require('../config');
var express = require('express');
var passport = require('passport');
var router = express.Router();


// Models
var GoLinkModel = require('../models/goLinkModel');


// Controllers
var indexController = require('../controllers/indexController');
var goLinkController = require('../controllers/goLinkController');

// TODO(allard): extract this out
var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
};

// TODO(allard): Extract this out.
// Parameter parsing
router.param('shortUri', function(req, res, next, shortUri) {
    console.log('Matching shortUri: ' + shortUri);
    GoLinkModel.find({shortUri: shortUri}, function(err, docs) {
        if (err) {
            res.json(err);
        }

        if (!docs[0]) {
            return next;
        }

        req.goLink = docs[0];
        next();
    });
});

// Google OAuth routes.
// TODO(allard): Put all of these into an auth controller
router.get(
    '/auth/google',
    passport.authenticate('google', {scope: config.passport.SCOPE}),
    function(req, res) {
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    }
);
router.get(
    '/auth/google/callback',
    passport.authenticate('google', {}),

    function(req, res) {
        res.redirect('/');
    }
);
router.get('/auth/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// Go Link Controllers
router.get('/', indexController.index);
router.get('/go-link', ensureAuthenticated, goLinkController.findAll);
router.get('/go-link/:shortUri', ensureAuthenticated, goLinkController.findByShortUri);
router.post('/go-link', ensureAuthenticated, goLinkController.create);

// Redirect a Go Link!
router.get('/:shortUri', indexController.redirect);

// Post-routing Middleware. Will always be invoked if non of the above routes catch the request.
router.use(function(req, res) {
    res.status(404).render('not-found');
});

module.exports = router;
