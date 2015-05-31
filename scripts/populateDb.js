#!/usr/bin/env node

/**
 * Prepopulates the local database with some Go-links read from file.
 */

'use strict';


var _ = require('lodash');
var mongoose = require('mongoose');
var Q = require('q');

// Models
var GoLinkModel = require('../app/models/goLinkModel');
var RedirectLogModel = require('../app/models/redirectLogModel');
var UserModel = require('../app/models/userModel');

// Fixture data
var goLinks = require('../fixtures/goLinksFixture.json');
var users = require('../fixtures/usersFixture.json');


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
    goLinks.forEach(function(goLink) {
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


var saveRedirects = function(links) {
    console.log('Saving redirect logs...');
    var redirects = [];

    links.forEach(function(link, i) {
        for (var j = 0; j <= i; j++) {
            redirects.push({goLinkId: link._id});
        }
    });

    return Q.npost(RedirectLogModel, 'create', redirects)
        .tap(function() {
            console.log('... Done!');
        });
};


// Run script.

// TODO(allard): Figure out how to pull this from the .env file manually.
mongoose.connect('mongodb://localhost:27017/go?auto_reconnect');

console.log('Starting to populate DB');
saveUsers()
    .then(saveLinks)
    .then(saveRedirects)
    .catch(function(err) {
        console.error('Failed to save:', err);
        return process.exit(-1);
    })
    .done(function() {
        console.log('Done populating DB!');
        return process.exit(0);
    });
