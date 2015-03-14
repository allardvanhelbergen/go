'use strict';


var Q = require('q');
var UserModel = require('../models/UserModel');


exports.createOrUpdate = function(req, res, next) {
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

        var createOrUpdateUser = function() {
            return Q.npost(UserModel, 'findOneAndUpdate', [query, update, {upsert: true}])
        }

        createOrUpdateUser()
            .catch(function(err) {
                console.error('DB error:', update);
                return next(err);
            })
            .done(function(doc) {
                res.locals.bwUser = req.bwUser = doc._doc;
                next();
            });
    } else {
        next();
    }
};
