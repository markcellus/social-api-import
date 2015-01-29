"use strict";

// set config options
require.config({
    baseUrl: '../',
    paths: {
        qunit: 'tests/qunit-require',
        sinon: 'bower_components/sinonjs/sinon',
        'test-utils': 'tests/test-utils',
        underscore: 'external/underscore/underscore',
        'element-kit': 'external/element-kit/element-kit'
    },
    shim: {
        sinon: {
            exports: 'sinon'
        }
    }
});

// require each test
require([
    'tests/facebook-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});