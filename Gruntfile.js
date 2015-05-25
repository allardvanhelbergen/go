module.exports = function(grunt) {
    'use strict';

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Configure all paths.
        paths: {
            js: [
                '**/*.js',
                '!node_modules/**/*',
                '!public/js/google-analytics.js'
            ],
            tests: [
                'tests/**/*.js'
            ]
        },

        // Configure all tasks.
        jshint: {
            all: '<%= paths.js %>',
            options: {
                force: true,
                jshintrc: true,
                reporter: require('jshint-stylish')
            }
        },
        jscs: {
            all: '<%= paths.js %>',
            options: {
                config: '.jscsrc',
                force: true
            }
        },
        mochaTest: {
            all: {
                src: '<%= paths.tests %>'
            },
            options: {
                reporter: 'dot'
            }
        }
    });

    // Register Grunt tasks.
    grunt.registerTask('default', ['validate', 'test']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('validate', ['jshint', 'jscs']);
};
