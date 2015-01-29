define([
    'sinon',
    'qunit',
    'test-utils',
    'src/facebook'
], function(
    Sinon,
    QUnit,
    TestUtils,
    Facebook
){
    "use strict";

    QUnit.module('Facebook Tests');


    QUnit.test('loading the script and retrieving FB object', function () {
        QUnit.expect(7);
        var testSrcUrl = 'my-script.js';
        var loadOptions = {
            apiConfig: {
                appId: 'your-app-id',
                xfbml: true,
                version: 'v2.1'
            },
            scriptUrl: testSrcUrl
        };
        var callbackSpy = Sinon.spy();
        var scriptsParentNode = document.createElement('div');
        // setup html facebook expects
        var scriptEl = document.createElement('script');
        scriptsParentNode.appendChild(scriptEl);
        var getElementsByTagNameStub = Sinon.stub(document, 'getElementsByTagName').returns([scriptEl]);
        var origFB = window.FB;
        window.FB = {init: Sinon.spy()};
        //QUnit.ok(!scriptEl.getElementById('facebook-jssdk'), 'facebook script is NOT in the DOM because load hasnt been called');
        QUnit.ok(!scriptsParentNode.querySelector('#facebook-jssdk'), 'facebook script is NOT in the DOM because load hasnt been called');
        Facebook.load(loadOptions, callbackSpy);
        QUnit.ok(scriptsParentNode.querySelector('#facebook-jssdk'), 'facebook script is in the DOM when load is called');
        QUnit.equal(scriptsParentNode.querySelector('#facebook-jssdk').getAttribute('src'), testSrcUrl, 'script url passed in load method options was used as the FB script path');
        QUnit.equal(callbackSpy.callCount, 0, 'callback is NOT fired yet because facebook hasnt loaded');
        QUnit.equal(window.FB.init.callCount, 0, 'FB.init() was NOT yet called');
        window.fbAsyncInit(); // trigger fb load
        QUnit.deepEqual(callbackSpy.args[0], [window.FB], 'callback is fired with the FB object when facebook is loaded');
        QUnit.deepEqual(window.FB.init.args[0], [loadOptions.apiConfig], 'FB.init() is called with correct api configuration object');
        getElementsByTagNameStub.restore();
        window.FB = origFB;
    });
});