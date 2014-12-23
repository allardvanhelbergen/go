'use strict';


var express = require('express');
var favicon = require('serve-favicon');
var passport = require('passport');
var path = require('path');
var router = express.Router();


// Models
var GoLinkModel = require('../models/goLinkModel');


// Controllers
var indexController = require('../controllers/indexController');
var goLinkController = require('../controllers/goLinkController');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth/google');
}

// Parameter parsing
router.param('shortUri', function(req, res, next, shortUri) {
    console.log('Matching shortUri: ' + shortUri);
    GoLinkModel.find({shortUri: shortUri}, function(err, docs) {
        if (err) {
            res.json(err);
        }
        console.log(docs);
        req.goLink = docs[0];
        next();
    });
});

// Set pre-route Middleware.
router.use(favicon(path.join('.', 'public', 'favicon.ico')));
router.use(express.static(path.join('.', 'public')));

// Routes
router.get('/', ensureAuthenticated, indexController.index);
router.get('/go-link', goLinkController.findAll);
router.get('/go-link/:shortUri', goLinkController.findByShortUri);
// router.post('/go-link', goLink.add);
// router.delete('/go-link/:link_id', links.delete);
// router.get('/not-found', indexController.notFound);
router.get('/:shortUri', indexController.redirect);

router.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'] }),
    function(req, res){
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    });
router.get('/auth/google/callback', passport.authenticate('google', {}), function(req, res) {
    res.redirect('/');
});

// Post-routing Middleware. Will always be invoked if non of the above routes catch the request.
router.use(function(req, res) {
    res.status(404).render('not-found');
});

module.exports = router;
