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
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var express = require('express');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var fs = require('fs');
var logging = require('./lib/logging');
var methodOverride = require('method-override');
var middleware = require('./lib/middleware');
var mongoose = require('mongoose');
var morgan = require('morgan');
var packageJson = require('./package.json');
var passport = require('passport');
var path = require('path');
var router = require('./lib/router');
var session = require('express-session');
var winston = require('winston');

// Controllers
var ErrorController = require('./controllers/errorController');
var UserController = require('./controllers/userController');
var OAuthController = require('./controllers/oAuthController');


// Initialize logging through Winston
logging.init();

// Initialize authentication
OAuthController.initOauth();

// Set database.
// TODO(allard): Move to config. Add default.
mongoose.connect('mongodb://' + process.env.MONGO_HOSTNAME + '/' + process.env.MONGO_DATABASE + '?auto_reconnect');

// Initialise the app.
var app = express();


app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));  // Templating
app.set('view engine', 'hbs');
// TODO(allard): Move to config. Add default.
// TODO(allard): Should I be doing this here or be putting all of this in config and ignoring app.set?
app.set('port', process.env.NODE_PORT || config.http.PORT);
app.set('env', process.env.NODE_ENV || config.http.ENV);
app.set('package', packageJson);

// Pre-routing Middleware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride(middleware.parseRequestMethodValue));
app.use(morgan('dev'));  // Format logging with Morgan
// Favicon and Static paths need to go before Session middleware to avoid superfluous session creation.
app.use(favicon(path.join('.', 'public', 'favicon.ico')));
app.use(express.static(path.join('.', 'public')));
// Session Cookie Middleware
app.use(cookieParser());
app.use(session({
    // TODO(allard): Move to config. Add default.
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: true
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(UserController.createOrUpdate);  // Save the user to the DB
app.use(middleware.putConfigInLocals);

// Routes
app.use(router);

// Post-routing Middleware.
app.use(ErrorController.renderRouteNotFound);
app.use(ErrorController.renderError);


// Run the server.
app.listen(app.get('port'), function() {
    fs.readFile(path.join(__dirname, 'fixtures', 'LAUNCH_MESSAGE.txt'), 'utf-8', function(err, data) {
        if (err) {
            return winston.error('Read file error:', err);
        }
        winston.warn(data);
        winston.warn('App running in %s mode.', app.get('env'));
        winston.warn('Server listening on http://localhost:%d.', app.get('port'));
    });
});
