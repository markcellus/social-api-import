'use strict';
module.exports = {
    build: {
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
