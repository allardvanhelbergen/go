'use strict';


/**
 * Validates if a shortUri is a permalink (alphanumeric and dashes only).
 * @param  {String} shortUri The shortUri to validate.
 * @return {Boolean}         TRUE: shortUri is a permalink.
 *                           FALSE: shortUri is not a permalink.
 */
exports.validateShortUri = function(shortUri) {
    return (shortUri.match(/^[a-z0-9\-]+$/)) ? true : false;
};