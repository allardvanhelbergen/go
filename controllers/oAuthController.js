'use strict';


var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


function initOauth() {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new GoogleStrategy({
            clientID: '<my-clientId>',
            clientSecret: '<my-clientSecret>',
            callbackURL: "http://localhost:3000/auth/google/callback"
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
