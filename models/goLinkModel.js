'use strict';


var mongoose = require('mongoose');


var GoLinkSchema = new mongoose.Schema({
    shortUri: {
        type: String,
        trim: true,
        required: true
    },
    longUri: {
        type: String,
        trim: true,
        required: true
    },
    ownerEmail: {
        type: String,
        default: null,
        trim: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now,
        required: true
    }
});


// Expose the model.
module.exports = mongoose.model('golinks', GoLinkSchema);
