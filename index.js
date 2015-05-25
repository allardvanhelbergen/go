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

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.error('Firing uncaughtException');
    console.dir(err, {showHidden: true, depth: null, colors: true});
    process.exit(1);
});
