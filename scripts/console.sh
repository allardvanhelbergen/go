#!/usr/bin/env node


'use strict';


require('../lib/app');
var repl = require('repl');

var myRepl = repl.start({
    prompt: 'Go Moonlander>',
    useColors: true
});

myRepl.on('exit', function() {
    console.log('Coming down...');
    process.exit(0);
});

App.init();
