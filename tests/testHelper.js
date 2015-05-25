'use strict';


var assert = require('assert');
var async = require('async');
var mongoose = require('mongoose');

require('../app/lib/app');


global.assert = assert;
App.init();
// TODO(allard): Figure out how to pass NODE_ENV var from cmd line, or automatically.
// process.env.NODE_ENV = 'test';



App.Test = {
    clearDb: function(done) {
        var models = ['golinks'];

        async.each(
            models,
            function(modelName, callback) {
                var model = mongoose.model(modelName);

                model.remove({}, callback);
            },
            function(err) {
                assert.ifError(err);
                done();
            }
        );
    }
};


beforeEach(function(done) {
    App.Test.clearDb(done);
});
