var gulp = require('gulp');
var browserify = require('gulp-browserify');
var del = require('del');
var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var copy = require('gulp-copy');
var concat = require('gulp-concat');

var paths = {
    src: [
        'src/facebook.js',
        'src/tumblr.js',
        'src/twitter.js',
        'src/instagram.js'
    ]
};

gulp.task('copy', function () {
    return gulp.src([
        'mocha.css',
        'mocha.js'
    ], {cwd: 'bower_components/mocha'})
        .pipe(copy('tests/mocha'));
});

gulp.task('test', ['copy', 'build-tests'], function () {
    return gulp
        .src('tests/runner.html')
        .pipe(mochaPhantomJS());
});

gulp.task('build-tests', function() {
    return gulp.src([
        'tumblr-tests.js',
        'facebook-tests.js',
        'twitter-tests.js'
    ], {cwd: 'tests'})
        .pipe(concat('built-tests.js'))
        .pipe(browserify())
        .pipe(gulp.dest('tests'));
});


gulp.task('build', function() {
    del(['dist']);
    return gulp.src(paths.src)
        .pipe(browserify())
        .pipe(gulp.dest('dist'));
});
