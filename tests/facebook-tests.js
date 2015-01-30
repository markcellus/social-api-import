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
        QUnit.expect(9);
        var loadOptions = {
            apiConfig: {
                appId: 'your-app-id'
            }
        };
        var callbackSpy = Sinon.spy();
        var scriptsParentNode = document.createElement('div');
        // setup html facebook expects
        var scriptEl = document.createElement('script');
        scriptsParentNode.appendChild(scriptEl);
        var getElementsByTagNameStub = Sinon.stub(document, 'getElementsByTagName').returns([scriptEl]);
        var origFB = window.FB;
        window.FB = {init: Sinon.spy()};
        QUnit.ok(!scriptsParentNode.querySelector('#facebook-jssdk'), 'facebook script is NOT in the DOM because load hasnt been called');
        Facebook.load(loadOptions, callbackSpy);
        QUnit.ok(scriptsParentNode.querySelector('#facebook-jssdk'), 'facebook script is in the DOM when load is called');
        QUnit.equal(scriptsParentNode.querySelector('#facebook-jssdk').getAttribute('src'), '//connect.facebook.net/en_US/sdk.js', 'script url is defaulted to correct path');
        QUnit.equal(callbackSpy.callCount, 0, 'callback is NOT fired yet because facebook hasnt loaded');
        QUnit.equal(window.FB.init.callCount, 0, 'FB.init() was NOT yet called');
        window.fbAsyncInit(); // trigger fb load
        QUnit.deepEqual(callbackSpy.args[0], [window.FB], 'callback is fired with the FB object when facebook is loaded');
        var FBInitOptions = window.FB.init.args[0][0];
        QUnit.equal(FBInitOptions.appId, loadOptions.apiConfig.appId, 'FB.init() is called with supplied appId');
        QUnit.equal(FBInitOptions.xfbml, true, 'object passed FB.init() includes xfbml property set to "true"');
        QUnit.equal(FBInitOptions.version, 'v2.1', 'object passed FB.init() includes version set to "v2.1"');
        getElementsByTagNameStub.restore();
        window.FB = origFB;
    });

    QUnit.test('loading the script with custom options', function () {
        QUnit.expect(1);
        var loadOptions = {
            apiConfig: {
                appId: 'your-app-id',
                xfbml: false,
                version: 'v2.5'
            },
            scriptUrl: 'my-script.js'
        };
        var scriptsParentNode = document.createElement('div');
        var scriptEl = document.createElement('script');
        scriptsParentNode.appendChild(scriptEl);
        var getElementsByTagNameStub = Sinon.stub(document, 'getElementsByTagName').returns([scriptEl]);
        var origFB = window.FB;
        window.FB = {init: Sinon.spy()};
        Facebook.load(loadOptions);
        window.fbAsyncInit(); // trigger fb load
        QUnit.deepEqual(window.FB.init.args[0], [loadOptions.apiConfig], 'after calling load(), FB.init() is called with correct api configuration object with custom options');
        getElementsByTagNameStub.restore();
        window.FB = origFB;
    });
});