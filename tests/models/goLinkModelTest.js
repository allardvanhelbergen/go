'use strict';


var mongoose = require('mongoose');

require('../testHelper');
var GoLinkModel = require(App.appPath + '/models/goLinkModel');


var ALPHA_NUM_DASH = 'abcdefghijklmnopqrstuvwxyz0123456789-';
var OTHER_CHAR = '!@#$%^&*()';
var validUser = {
    shortUri: ALPHA_NUM_DASH,
    longUri: 'http://example.com',
    ownerId: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
    owner: null
};
var invalidUser = {
    shortUri: OTHER_CHAR,
    longUri: 'http://example.com',
    ownerId: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
    owner: null
};


describe('goLinkModel', function() {
    describe('validateShortUri', function() {
        it('Saves valid users', function(done) {
            assert.doesNotThrow(function() {
                GoLinkModel.create(validUser, function(err, user) {
                    assert.ifError(err);
                    done();
                });
            });
        });

        // TODO(allard): This isn't working as expected for whatever reason... Need to learn more about tests.
        xit('Does not save invalid users', function(done) {
            assert.throws(
                function() {
                    GoLinkModel.create(invalidUser, function(err, user) {
                        assert.ifError(err);
                        done();
                    });
                },
                Error
            );
        });
    });
});
