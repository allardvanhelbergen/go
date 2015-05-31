'use strict';


var async = require('async');
var numeral = require('numeral');

var GoLinkModel = require('../models/goLinkModel');
var RedirectLogModel = require('../models/redirectLogModel');
// var UserModel = require('../models/UserModel');


var AVG_NR_WORKDAYS = 220;  // days per annum
var AVG_SALARY = 50000;  // euros per annum
var AVG_SALARY_PER_SECOND = AVG_SALARY / AVG_NR_WORKDAYS / 8 / 60 / 60;  // euros
var SECONDS_SAVED_PER_REDIRECT = 10;  // seconds


exports.edit = function(req, res, next) {
    res.render('admin/edit-test');
};


/**
 * GET: the stats page.
 */
exports.saved = function(req, res, next) {
    RedirectLogModel.count({}, function(err, redirectCount) {
        if (err) {
            // TODO(allard): DB errors
            return next(err);
        }

        var result = {};

        result.totalRedirects = numeral(redirectCount).format('0,0');
        result.timePerRedirect = numeral(SECONDS_SAVED_PER_REDIRECT).format('00');
        result.totalTimeSaved = numeral(redirectCount * SECONDS_SAVED_PER_REDIRECT).format('00:00:00');
        result.avgSalary = numeral(AVG_SALARY).format('0a');
        result.totalMoneySaved = numeral((redirectCount * SECONDS_SAVED_PER_REDIRECT * AVG_SALARY_PER_SECOND))
                .format('0,0.00');

        res.render('admin/saved', result);
    });
};


exports.stats = function(req, res, next) {
    async.parallel({
        totalRedirects: function(callback) {
            RedirectLogModel.count({}).exec(callback);
        },
        totalGoLinks: function(callback) {
            GoLinkModel.count({}).exec(callback);
        },
        totalUsers: function(callback) {
            // TODO(allard): Getting duplicate model error?!
            // UserModel.count({}).exec(callback);
            return callback(0);
        },
        topGoLinks: function(callback) {
            async.waterfall([
                function(next) {
                    RedirectLogModel.aggregate([
                        {$group: {_id: '$goLinkId', redirectCount: {$sum: 1}}},
                        {$sort: {redirectCount: -1}},
                        {$limit: 10}
                    ]).exec(next);
                },
                function(links, next) {
                    async.each(
                        links,
                        function(link, done) {
                            var i = links.indexOf(link);
                            GoLinkModel.findById(link._id, function(err, doc) {
                                links[i].position = i + 1;  // Starts at 0.
                                links[i].shortUri = doc.shortUri;
                                links[i].longUri = doc.longUri;
                                links[i].ownerId = doc.ownerId;

                                done(err);
                            });
                        },
                        function(err) {
                            next(err, links);
                        }
                    );
                }
                // for each link get user details per user id
                // TODO(allard): Add this when figured out User model bug.
                // function(links, next) {
                //     async.each(
                //         links,
                //         function(link, done) {
                //             var i = links.indexOf(link);
                //             UserModel.findById(link.ownerId, function(err, doc) {
                //                 links[i].owner = doc;

                //                 done(err);
                //             });
                //         },
                //         function(err) {
                //             next(err, links);
                //         }
                //     );
                // }
            ], function(err, links) {
                return callback(err, links);
            });
        }
    }, function(err, result) {
        if (err) {
            // TODO(allard): DB errors
            return next(err);
        }

        result.totalRedirects = numeral(result.totalRedirects).format('0,0');
        result.totalGoLinks = numeral(result.totalGoLinks).format('0,0');
        result.totalUsers = numeral(result.totalUsers).format('0,0');
        console.log(result);
        res.render('admin/stats', result);
    });
};
