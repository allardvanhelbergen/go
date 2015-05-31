'use strict';


var mongoose = require('mongoose');

var validators = require('../lib/validators');


var GoLinkSchema = new mongoose.Schema({
    shortUri: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: [validators.validateShortUri, 'Is not a valid Go link']
    },
    longUri: {
        type: String,
        trim: true,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'users',
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
        required: true
    }
});


// Expose the model.
module.exports = mongoose.model('golinks', GoLinkSchema);
