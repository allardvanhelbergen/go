'use strict';


var mongoose = require('mongoose');


var GoLinkSchema = new mongoose.Schema({
    shortUri: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    longUri: {
        type: String,
        trim: true,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'User',
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
