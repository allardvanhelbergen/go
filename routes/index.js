/**
 * All the routes for incoming requests.
 */


'use strict';


var config = require('../config');
var express = require('express');
var lib = require('../lib');
var passport = require('passport');
var router = express.Router();

// Models
var GoLinkModel = require('../models/goLinkModel');

// Controllers
var authController = require('../controllers/authController');
var indexController = require('../controllers/indexController');
var goLinkController = require('../controllers/goLinkController');


// Parameter parsing.
router.param('shortUri', lib.parseParam);

// Google OAuth routes.
// This request will be redirected to Google for authentication, so this function will not be called.
router.get('/auth/google', passport.authenticate('google', {scope: config.passport.SCOPE}), function() {/* sic */});
router.get('/auth/google/callback', passport.authenticate('google', {}), authController.logInSuccess);
router.get('/auth/logout', authController.logOutSuccess);

// Go Link Controller Routes.
router.get('/', indexController.index);
router.get('/go-link', lib.ensureAuthenticated, goLinkController.findAll);
router.get('/go-link/:shortUri', lib.ensureAuthenticated, goLinkController.findByShortUri);
router.post('/go-link', lib.ensureAuthenticated, goLinkController.create);

// Redirect a Go Link!
router.get('/:shortUri', indexController.redirect);

module.exports = router;
