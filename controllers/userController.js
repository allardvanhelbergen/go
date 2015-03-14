'use strict';


var UserModel = require('../models/UserModel');


exports.saveOrUpdate = function(req, res, next) {
    res.locals.session = req.session;

    if (req.user) {
        res.locals.user = req.user;

        var query = {
            email: req.user.emails[0].value
        };
        var update = {
            name: req.user.name.givenName,
            email: req.user.emails[0].value,
            pictureUrl: req.user._json.picture
        };

        UserModel.findOneAndUpdate(query, update, {upsert: true}, function(err, doc) {
            if (err) {
                console.error('DB error:', update);
            }

            res.locals.bwUser = doc._doc;
            console.log(res.locals.bwUser);
        });

        // TODO(allard): Do I need a next() here too?
    }

    next();
};
