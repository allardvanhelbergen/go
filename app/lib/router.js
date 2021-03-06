/**
 * All the routes for incoming requests.
 */

'use strict';


var config = require('../../config');
var express = require('express');
var middleware = require('../lib/middleware');
var passport = require('passport');
var router = express.Router();

// Controllers
var adminController = require('../controllers/adminController');
var authController = require('../controllers/authController');
var indexController = require('../controllers/indexController');
var goLinkController = require('../controllers/goLinkController');


// Parameter parsing
router.param('shortUri', middleware.parseParam);


// Google OAuth routes
// This request will be redirected to Google for authentication, so this function will not be called.
router.get('/_auth/google', passport.authenticate('google', {scope: config.passport.SCOPE}), function() {/* sic */});
router.get('/_auth/google/callback', passport.authenticate('google', {}), authController.logInSuccess);
router.get('/_auth/logout', authController.logOutSuccess);

// Admin Routes
router.get('/_admin/edit-test', adminController.edit);
router.get('/_admin/saved', adminController.saved);
router.get('/_admin/stats', adminController.stats);

// API Routes
router.get('/_api/go-link.:format?', goLinkController.findAll);
router.post('/_api/go-link', middleware.ensureAuthenticated, goLinkController.create);
router.get('/_api/go-link/:id.:format?', goLinkController.read);
// TODO(allard): Move to Query String Params with req.query, GET /_api/go-link.json?short={shortUri}
router.get('/_api/go-link/short/:shortUri.:format?', goLinkController.findByShortUri);
router.put('/_api/go-link/short/:shortUri', middleware.ensureAuthenticated, goLinkController.updateTest);

// Index
router.get('/', indexController.index);
router.get('/:shortUri', indexController.redirect);


module.exports = router;
