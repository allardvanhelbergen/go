'use strict';


var Q = require('q');
var UserModel = require('../models/userModel');
var winston = require('winston');


exports.createOrUpdate = function(req, res, next) {
    // TODO(allard): does this belong here?
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
            return Q.npost(UserModel, 'findOneAndUpdate', [query, update, {upsert: true}]);
        };

        createOrUpdateUser()
            .catch(function(err) {
                // TODO(allard): DB errors
                return next(err);
            })
            .done(function(doc) {
                // TODO(allard): should this go somewhere else? It would be better to call the user ID from session.
                // This log is temporary to figure out the bug where doc is null
                if (!doc) {
                    winston.error('doc is apparently null...');
                    winston.error(doc, req, res, query, update);
                }
                res.locals.bwUser = req.bwUser = doc._doc;
                return next();
            });
    } else {
        return next();
    }
};
