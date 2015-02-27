/**
 * Go - Brandwatch Internal Custom URL Creator
 *
 *         |
 *        / \
 *       / _ \
 *      |.o '.|
 *      |'._.'|
 *      |     |
 *    ,'|  |  |`.
 *   /  |  |  |  \
 *   |,-'--|--'-.|
 *
 * Main application entry file. This does all the configuration loading, and booting of controllers and custom
 * error handlers. Please note, the order of loading is important.
 */

'use strict';


// Module dependencies.
var bodyParser = require('body-parser');
var config = require('./config');
// var errorhandler = ('errorhandler');
var exphbs = require('express-handlebars');
var express = require('express');
var fs = require('fs');
// var methodOverride = require('method-override');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var router = require('./routes');

var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: '<my-clientID>',
        clientSecret: '<my-clientSecret>',
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        if(profile._json.hd === 'brandwatch.com'){
            process.nextTick(function () {
                return done(null, profile);
            });
        } else {
            done(new Error('Invalid host domain'));
        }

    }
));


// Set database.
mongoose.connect(config.mongodb.uri);


// Initialise the app.
var app = express();

// Set environment variables - ALL
app.set('port', process.env.PORT || config.http.port);

// Set view engine.
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// Set logging.
app.use(morgan('dev'));

// Set envirionment variables - DEV
if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler());
}

// Set envirionment variables - PROD
// if (app.get('env') === 'production') {
//     app.enable('view cache');
// }

// Set pre-route Middleware.
app.use(bodyParser.urlencoded({extended: false}));

// Set Routes.
app.use(router);

// Run the server.
app.listen(app.get('port'), function() {
    fs.readFile(path.join(__dirname, 'fixtures', 'LAUNCH_MESSAGE.txt'), 'utf-8', function(err, data) {
        if (err) {
            return console.error(err);
        }
        console.log(data);
        console.log('Express server listening on http://localhost:' + app.get('port'));
    });
});
