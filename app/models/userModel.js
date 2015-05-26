'use strict';


var mongoose = require('mongoose');
var config = require('../../config');


var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    pictureUrl: {
        type: String,
        default: config.app.USER_PROFILE_IMG
    }
});


// Expose the model
module.exports = mongoose.model('users', UserSchema);
