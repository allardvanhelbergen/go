'use strict';


var numeral = require('numeral');
var RedirectLogModel = require('../models/redirectLogModel');


var AVG_NR_WORKDAYS = 220;  // days per annum
var AVG_SALARY = 50000;  // euros per annum
var AVG_SALARY_PER_SECOND = AVG_SALARY / AVG_NR_WORKDAYS / 8 / 60 / 60;  // euros
var SECONDS_SAVED_PER_REDIRECT = 10;  // seconds


/**
 * GET: the stats page.
 */
exports.saved = function(req, res, next) {
    RedirectLogModel.count({}, function(err, redirectCount) {
        if (err) {
            return next(err);
        }

        var result = {};

        result.totalRedirects = numeral(redirectCount).format('0,0');
        result.timePerRedirect = numeral(SECONDS_SAVED_PER_REDIRECT).format('00');
        result.totalTimeSaved = numeral(redirectCount * SECONDS_SAVED_PER_REDIRECT).format('00:00:00');
        result.avgSalary = numeral(AVG_SALARY).format('0a');
        result.totalMoneySaved = numeral((redirectCount * SECONDS_SAVED_PER_REDIRECT * AVG_SALARY_PER_SECOND)).format('0,0.00');

        res.render('saved', result);
    });
};
