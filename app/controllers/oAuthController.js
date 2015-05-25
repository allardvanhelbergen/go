'use strict';


var config = require('../../config');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// TODO(allard): Perhaps this should be in lib?
function initOauth() {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new GoogleStrategy({
            clientID: config.passport.CLIENTID,
            clientSecret: config.passport.CLIENTSECRET,
            // TODO(allard): The port is hardcoded in this variable which sucks. Do sth about it!
            callbackURL: config.passport.CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, done) {
            if (profile._json.hd === 'brandwatch.com'){
                process.nextTick(function() {
                    return done(null, profile);
                });
            } else {
                done(null, false);
            }

        }
    ));
}


exports.initOauth = initOauth;
