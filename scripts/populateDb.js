#!/usr/bin/env node

/**
 * Prepopulates the local database with some Go-links read from file.
 */

'use strict';


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
    var userCount = 0;

    return Q.all(users.map(function(user) {
        var userModel = new UserModel({
            name: user.name,
            email: user.email
        });

        return Q.npost(userModel, 'save')
        .catch(function(err) {
            console.error('Failed to save user: %j', userModel);
            console.error(err);
            process.exit(-1);
        })
        .tap(function() {
            ++userCount;
            console.log('Saved user %d:', userCount, userModel.name);
        });
    }))
    .tap(function() {
        console.log('... Done!');
    });
};


var saveLinks = function(docs) {
    var goLinkCount = 0;

    // Clean up the wrapping from the promises.
    var users = [];
    docs.forEach(function(doc) {
        users.push(doc[0]);
    })

    console.log('Saving links...');
    return Q.all(goLinks.map(function(goLink, i) {
        var owner = users.filter(function(user) {
            return user.email === goLink.owner;
        })[0];  // Take the first of the array as there should only be one element.

        var goLinkModel = new GoLinkModel({
            shortUri: goLink.shortUri,
            longUri: goLink.longUri,
            ownerId: owner._id
        })

        return Q.npost(goLinkModel, 'save')
        .catch(function(err) {
            console.error('Failed to save goLink: %j', goLinkModel);
            console.error(err);
            process.exit(-1);
        })
        .tap(function() {
            ++goLinkCount;
            console.log('Saved goLink nr %d:', goLinkCount, goLinkModel.shortUri);
        })
    }))
    .tap(function() {
        console.log('... Done!')
    });
};


// Run script.
console.log('Starting to populate DB');
saveUsers()
    .then(saveLinks)
    .done(function() {
        console.log('Done populating DB!')
        return process.exit(0);
    });
