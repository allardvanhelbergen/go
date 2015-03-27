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
var exphbs = require('express-handlebars');
var express = require('express');
var favicon = require('serve-favicon');
var fs = require('fs');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var path = require('path');
var router = require('./routes');
var session = require('express-session');
var UserController = require('./controllers/userController');
var oauthController = require('./controllers/oauthController');

//initialize authentication
oauthController.initOauth();

// Set database.
mongoose.connect(config.mongodb.uri);

// Initialise the app.
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));  //
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || config.http.port);


app.use(morgan('dev'));  // Logging
// Favicon and Static paths need to go before Session middleware to avoid superfluous session creation.
app.use(favicon(path.join('.', 'public', 'favicon.ico')));
app.use(express.static(path.join('.', 'public')));
// TODO(allard); Does this need to be pulled out?
app.use(session({secret: 'keyboard cat'}));  // Session Auth
app.use(passport.initialize());
app.use(passport.session());
// TODO(allard); This probably needs to go somewhere nicer, like ./lib?
app.use(UserController.createOrUpdate);  // Save the user to the DB
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);  // Routes


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
