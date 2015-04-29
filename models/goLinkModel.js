'use strict';


var mongoose = require('mongoose');


/**
 * Validates if a shortUri is a permalink (alphanumeric and dashes only).
 * @param  {String} shortUri The shortUri to validate.
 * @return {Boolean}         TRUE: shortUri is a permalink.
 *                           FALSE: shortUri is not a permalink.
 */
var validateShortUri = function(shortUri) {
    return (shortUri.match(/^[a-z0-9\-]+$/)) ? true : false;
};


var GoLinkSchema = new mongoose.Schema({
    shortUri: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: [validateShortUri, 'Is not a valid Go link']
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
