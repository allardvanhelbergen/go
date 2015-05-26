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
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var express = require('express');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var fs = require('fs');
var methodOverride = require('method-override');
var morgan = require('morgan');
var passport = require('passport');
var path = require('path');
var session = require('express-session');
var winston = require('winston');

// App Modules
var config = require('../../config');
var db = require('./db');
var logging = require('./logging');
var middleware = require('./middleware');
var router = require('./router');

// Controllers
var ErrorController = require('../controllers/errorController');
var UserController = require('../controllers/userController');
var OAuthController = require('../controllers/oAuthController');


global.App = {
    app: express(),
    appPath: path.join(__dirname, '..'),
    rootPath: path.join(__dirname, '..', '..'),


    /**
     * Initialise the app. Pull in all middlewares, routing, etc.
     */
    init: function() {
        logging.init();  // Logging through Winston
        OAuthController.initOauth();  // Authentication
        db.connect();  // Mongo database


        // Templating
        this.app.engine('hbs', exphbs({
            defaultLayout: 'main',
            extname: 'hbs',
            layoutsDir: path.join(this.appPath, 'views', 'layouts'),
            partialsDir: path.join(this.appPath, 'views', 'partials')
        }));
        this.app.set('view engine', 'hbs');
        this.app.set('views', path.join(this.appPath, 'views'));

        // Pre-routing Middleware.
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(methodOverride(middleware.parseRequestMethodValue));
        this.app.use(morgan('dev'));  // Format logging with Morgan
        // Favicon and Static paths need to go before Session middleware to avoid superfluous session creation.
        this.app.use(favicon(path.join(this.rootPath, 'public', 'favicon.ico')));
        this.app.use(express.static(path.join(this.rootPath, 'public')));
        // Session Cookie Middleware
        this.app.use(cookieParser());
        this.app.use(session({
            // TODO(allard): Move to config. Add default.
            secret: config.session.SECRET,
            saveUninitialized: true,
            resave: true,
            cookie: {
                httpOnly: true
            }
        }));
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        // TODO(allard): Move this to the session serialisation function.
        this.app.use(UserController.createOrUpdate);  // Save the user to the DB
        this.app.use(middleware.putConfigInLocals);

        // Routes
        this.app.use(router);

        // Post-routing Middleware.
        this.app.use(ErrorController.renderRouteNotFound);
        this.app.use(ErrorController.renderError);
    },

    /**
     * Start the server to listen on the configured port.
     * Throw an error if there is an error, such as the port being taken.
     */
    start: function() {
        winston.info('Starting the app...');

        if (!this.started) {
            this.started = true;
            this.app.listen(config.http.PORT, logSuccessfulLaunch)
                .on('error', function(err) {
                    this.started = false;
                    if (err.errno === 'EADDRINUSE') {
                        winston.error('This launchpad has already been taken.');
                        winston.error('Port:', config.http.PORT);
                    } else {
                        winston.error(err);
                    }
                    throw err;
                });
        }
    }
};


/**
 * Log a succesful launch.
 */
var logSuccessfulLaunch = function() {
    fs.readFile(path.join(App.appPath, 'lib', 'LAUNCH_MESSAGE.txt'), 'utf-8', function(err, launchMessage) {
        if (err) {
            return winston.error('Read file error:', err);
        }
        winston.warn(launchMessage);
        winston.info('App running in %s mode.', config.http.ENV);
        winston.info('Server listening on http://localhost:%d.', config.http.PORT);
    });
};


module.exports = App;
