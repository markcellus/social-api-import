module.exports = {
    build: {
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
    },
    tests: {
        mocha: {
            files: ['tests/*.js']
        }
    }
};
