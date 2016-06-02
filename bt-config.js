'use strict';
module.exports = {
    build: {
        production: {
            files: {
                'dist/social-api.js': ['index.js']
            },
            browserifyOptions: {
                standalone: 'SocialAPI'
            },
            minifyFiles: {
                'dist/social-api-min.js': ['dist/social-api.js']
            },
            bannerFiles: ['dist/*']
        }
    },
    tests: {
        mocha: {
            src: ['tests/*.js']
        }
    }
};
