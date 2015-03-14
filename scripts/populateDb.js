#!/usr/bin/env node

/**
 * Prepopulates the local database with some Go-links read from file.
 */

'use strict';


var _ = require('lodash');
var Q = require('q');
var mongoose = require('mongoose');

// Models
var GoLinkModel = require('../models/goLinkModel');
var UserModel = require('../models/UserModel');

// Fixture data
var goLinks = require('../fixtures/goLinksFixture.json');
var users = require('../fixtures/usersFixture.json');


// Connect to database.
// TODO(allard); Move all of this DB stuff into config or sth.
mongoose.connect('mongodb://localhost:27017/go?auto_reconnect');


var saveUsers = function() {
    console.log('Saving users...');

    return Q.npost(UserModel, 'create', users)
        .tap(function() {
            console.log('... Done!');
        });
};


var saveLinks = function(users) {
    console.log('Saving links...');
    var owner;

    if (!users) {
        return new Error('No user docs array returned');
    }

    // Add the correct user id to each go link.
    goLinks.forEach(function(goLink, i) {
        owner = _.find(users, function(user) {
            return user.email === goLink.owner;
        });

        goLink.ownerId = owner._id;
    });

    return Q.npost(GoLinkModel, 'create', goLinks)
        .tap(function() {
            console.log('... Done!');
        });
};


// Run script.
console.log('Starting to populate DB');
saveUsers()
    .then(saveLinks)
    .catch(function(err) {
        console.error('Failed to save:', err);
        return process.exit(-1);
    })
    .done(function() {
        console.log('Done populating DB!');
        return process.exit(0);
    });
