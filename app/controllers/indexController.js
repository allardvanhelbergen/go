'use strict';

var async = require('async');
var util = require('util');
var winston = require('winston');

var GoLinkModel = require('../models/goLinkModel');
var RedirectLogModel = require('../models/redirectLogModel');
var UserModel = require('../models/userModel');


/**
 * GET: the home page.
 */
exports.index = function(req, res, next) {
    async.parallel({
        goLinks: function(callback) {
            GoLinkModel.find()
                .sort({shortUri: 1})
                .populate('ownerId')
                .exec(callback);
        },
        myLinks: function(callback) {
            if (!req.isAuthenticated()) {
                return callback();  // Do nothing if there is no user.
            }

            async.waterfall([
                function(callback) {
                    UserModel.findOne({email: req.user._json.email})
                        .exec(callback);
                },
                function(user, callback) {
                    GoLinkModel.find({ownerId: user.id})
                        .sort({shortUri: 1})
                        .exec(callback);
                },
                function(myLinks, callback) {
                    // call map here
                    async.each(myLinks, function(link, done) {
                        var i = myLinks.indexOf(link);
                        RedirectLogModel.count({goLinkId: link.id})
                            .exec(function(err, count) {
                                myLinks[i].redirects = count;
                                done();
                            });
                    }, function(err) {
                        callback(err, myLinks);
                    });
                }
            ], function(err, result) {
                callback(err, result);
            });
        }
    },
    function(err, results) {
        if (err) {
            // TODO(allard): DB errors
            return next(err);
        }

        res.render('index', results);
    });
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
            // TODO(allard): DB errors
            // Do not return next() here, as this callback will resolve at later point in time.
            winston.error('Error saving to redirect logs.', util.inspect(err));
        }

        winston.info('Updated redirect log.');
        winston.debug(util.inspect(doc));
    });

    // Redirect
    winston.info('Redirecting:', util.inspect(req.goLink.longUri));
    res.redirect(req.goLink.longUri);
};
