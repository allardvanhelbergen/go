'use strict';


var RedirectLogModel = require('../models/redirectLogModel');


/**
 * GET: the stats page.
 */
exports.stats = function(req, res) {
    var result = {};

    RedirectLogModel.count({}, function(err, count) {
        result.redirectCount = count;
        result.timeSaved = result.redirectCount * 10;
        result.moneySaved = result.timeSaved * (50000 / 12 / 20 / 8 / 60 / 60);

        console.log(count);
        console.log(result);
        res.render('stats', result);
    });
};
