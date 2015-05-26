/**
 * Go - Brandwatch Internal Custom URL Creator
 *
 *         |
 *        / \
 *       / _ \
 *      |.o '.|
 *      |'._.'|
 *      |     |
 *    ,'|  |  |`.
 *   /  |  |  |  \
 *   |,-'--|--'-.|
 *
 * Main application entry file.
 */

'use strict';


var App = require('./app/lib/app');


// Initalise the app and run the server.
App.init();
App.start();


/**
 * Listen to uncaught errors and make them visible.
 * This is necessary as foreman and nodemon tend to swallow errors sometimes.
 */
process.on('uncaughtException', function(err) {
    console.error('Obviously a major malfunction. - Firing uncaughtException');
    console.error(err);
    throw err;
    process.exit(1);
});
