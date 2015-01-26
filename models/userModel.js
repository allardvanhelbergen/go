'use strict';


var mongoose = require('mongoose');


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
    }
});


// Expose the model
module.exports = mongoose.model('users', UserSchema);