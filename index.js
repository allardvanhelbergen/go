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
 * error handlers.
 *
 * Please note, the order of loading is important.
 */


'use strict';


// Module dependencies.
var bodyParser = require('body-parser');
var config = require('./config');
var exphbs = require('express-handlebars');
var express = require('express');
var favicon = require('serve-favicon');
var fs = require('fs');
var logging = require('./lib/logging');
var middleware = require('./lib/middleware');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var path = require('path');
var router = require('./routes');
var session = require('express-session');
var winston = require('winston');
var UserController = require('./controllers/userController');
var OAuthController = require('./controllers/oAuthController');

logging.init();

//initialize authentication
OAuthController.initOauth();

// Set database.
mongoose.connect('mongodb://' + process.env.MONGO_HOSTNAME + '/' + process.env.MONGO_DATABASE + '?auto_reconnect');

// Initialise the app.
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));  //
app.set('view engine', 'handlebars');
app.set('port', process.env.NODE_PORT || config.http.PORT);

// Pre-routing Middleware.
app.use(morgan('dev'));  // Logging
// Favicon and Static paths need to go before Session middleware to avoid superfluous session creation.
app.use(favicon(path.join('.', 'public', 'favicon.ico')));
app.use(express.static(path.join('.', 'public')));
app.use(middleware.putConfigInLocals);
// Session Cookie Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(UserController.createOrUpdate);  // Save the user to the DB
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use(router);

// Post-routing Middleware.
app.use(middleware.renderError);
app.use(middleware.renderRouteNotFound);


// Run the server.
app.listen(app.get('port'), function() {
    fs.readFile(path.join(__dirname, 'fixtures', 'LAUNCH_MESSAGE.txt'), 'utf-8', function(err, data) {
        if (err) {
            return winston.error('Read file error:', err);
        }
        winston.info(data);
        winston.info('Express server listening on http://localhost:' + app.get('port'));
    });
});
