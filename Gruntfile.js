module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bt: {
            dist: ['dist']
        },
        browserify: {
            dist: {
                files: {
                    'dist/facebook.js': ['src/facebook.js'],
                    'dist/instagram.js': ['src/instagram.js'],
                    'dist/tumblr.js': ['src/tumblr.js'],
                    'dist/twitter.js': ['src/twitter.js']
                }
            }
        }
    });

    // Load grunt tasks from node modules
    require("load-grunt-tasks")(grunt);

    grunt.registerTask( "build", [
        "browserify"
    ]);

};