/**
 * The App variable
 *
 * Loads the configuration, controllers and custom error handlers as well as define some static helper functions.
 *
 * Please note, the order of loading is important.
 */

'use strict';


// Module dependencies.
var bodyParser = require('body-parser');
var config = require('../config');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var express = require('express');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var fs = require('fs');
var logging = require('./logging');
var methodOverride = require('method-override');
var middleware = require('./middleware');
var mongoose = require('mongoose');
var morgan = require('morgan');
var packageJson = require('../package.json');
var passport = require('passport');
var path = require('path');
var router = require('./router');
var session = require('express-session');
var winston = require('winston');

// Controllers
var ErrorController = require('../controllers/errorController');
var UserController = require('../controllers/userController');
var OAuthController = require('../controllers/oAuthController');


var logSuccessfulLaunch = function() {
    fs.readFile(path.join(__dirname, '..', 'fixtures', 'LAUNCH_MESSAGE.txt'), 'utf-8', function(err, data) {
        if (err) {
            return winston.error('Read file error:', err);
        }
        winston.warn(data);
        winston.warn('App running in %s mode.', App.app.get('env'));
        winston.warn('Server listening on http://localhost:%d.', App.app.get('port'));
    });
}

global.App = {
    app: express(),
    port: process.env.PORT,
    version: packageJson.version,
    root: path.join(__dirname, '..'),
    env: process.env.port,


    initialize: function() {

        // Initialize logging through Winston
        logging.init();

        // Initialize authentication
        OAuthController.initOauth();

        // Set database.
        // TODO(allard): Move to config. Add default.
        mongoose.connect('mongodb://' + process.env.MONGO_HOSTNAME + '/' +
                         process.env.MONGO_DATABASE + '?auto_reconnect');


        this.app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));  // Templating
        this.app.set('view engine', 'hbs');
        // TODO(allard): Move to config. Add default.
        // TODO(allard): Should I be doing this here or be putting all of this in config and ignoring app.set?
        this.app.set('port', process.env.NODE_PORT || config.http.PORT);
        this.app.set('env', process.env.NODE_ENV || config.http.ENV);
        this.app.set('package', packageJson);

        // Pre-routing Middleware.
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(methodOverride(middleware.parseRequestMethodValue));
        this.app.use(morgan('dev'));  // Format logging with Morgan
        // Favicon and Static paths need to go before Session middleware to avoid superfluous session creation.
        this.app.use(favicon(path.join('.', 'public', 'favicon.ico')));
        this.app.use(express.static(path.join('.', 'public')));
        // Session Cookie Middleware
        this.app.use(cookieParser());
        this.app.use(session({
            // TODO(allard): Move to config. Add default.
            secret: process.env.SESSION_SECRET,
            saveUninitialized: true,
            resave: true,
            cookie: {
                httpOnly: true
            }
        }));
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(UserController.createOrUpdate);  // Save the user to the DB
        this.app.use(middleware.putConfigInLocals);

        // Routes
        this.app.use(router);

        // Post-routing Middleware.
        this.app.use(ErrorController.renderRouteNotFound);
        this.app.use(ErrorController.renderError);
    },

    start: function() {
        if (!this.started) {
            this.started = true;
            // Run the server.
            // TODO(allard): Bind isn't working here... Don't know what I'm doing wrong...
            this.app.listen(this.app.get('port'), logSuccessfulLaunch);
        }
    }
};


module.exports = App;
