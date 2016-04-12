'use strict';
module.exports = {
    build: {
        prod: {
            dist: 'dist',
            files: {
                'dist/facebook.js': ['src/facebook.js'],
                'dist/instagram.js': ['src/instagram.js'],
                'dist/tumblr.js': ['src/tumblr.js'],
                'dist/twitter.js': ['src/twitter.js'],
                'dist/vine.js': ['src/vine.js']
            },
            browserifyOptions: {
                standalone: 'SocialApi'
            },
            minifyFiles: {
                'dist/facebook-min.js': ['dist/facebook.js'],
                'dist/instagram-min.js': ['dist/instagram.js'],
                'dist/tumblr-min.js': ['dist/tumblr.js'],
                'dist/twitter-min.js': ['dist/twitter.js'],
                'dist/vine-min.js': ['dist/vine.js']
            },
            bannerFiles: ['dist/*']
        },
        local: {
            files: {
                'demo/main-built.js': ['demo/main.js']
            }
        }
    },
    tests: {
        mocha: {
            src: ['tests/*.js']
        }
    }
};
