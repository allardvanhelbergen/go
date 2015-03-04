module.exports = function(grunt) {
    'use strict';

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Configure all paths.
        paths: {
            js: [
                '*.js',
                'config/**/*.js',
                'controllers/**/*.js',
                'fixtures/**/*.js',
                'models/**/*.js',
                'public/**/*.js',
                'routes/**/*.js',
                'scripts/**/*.js',
                'views/**/*.js'
            ]
        },

        // Configure all tasks.
        jshint: {
            all: '<%= paths.js %>',
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            }
        },
        jscs: {
            src: '<%= paths.js %>',
            options: {
                config: '.jscsrc'
            }
        }
    });

    // Register Grunt tasks.
    grunt.registerTask('default', ['validate']);
    grunt.registerTask('validate', ['jshint', 'jscs']);
};
