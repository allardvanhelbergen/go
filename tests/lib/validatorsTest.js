'use strict';


require('../testHelper');
var validators = require('../../app/lib/validators');

var ALPHA_NUM_DASH = 'abcdefghijklmnopqrstuvwxyz0123456789-';
var OTHER_CHAR = '!@#$%^&*()';


describe('validators', function() {
    describe('validateShortUri', function() {
        it('Validates alphanumeric and dash chars', function() {
            assert(validators.validateShortUri(ALPHA_NUM_DASH));
        });

        it('Invalidates other chars', function() {
            assert.equal(validators.validateShortUri(OTHER_CHAR), false);
        });
    });
});

