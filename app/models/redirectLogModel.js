'use strict';


var mongoose = require('mongoose');


var RedirectLogSchema = new mongoose.Schema({
    goLinkId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'GoLink',
        required: true
    },
    redirected: {
        type: Date,
        default: Date.now,
        required: true
    }
});


// Expose the model.
module.exports = mongoose.model('redirectlogs', RedirectLogSchema);
