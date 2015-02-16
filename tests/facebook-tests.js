var sinon = require('sinon');
var assert = require('assert');
var Facebook = require('./../src/facebook');

describe('Facebook', function () {
    it('should load the script and hoist FB object', function () {
        var loadOptions = {
            apiConfig: {
                appId: 'your-app-id'
            }
        };
        var callbackSpy = sinon.spy();
        // setup html facebook expects
        var scriptEl = document.createElement('script');
        var createScriptElementStub = sinon.stub(Facebook, 'createScriptElement').returns(scriptEl);
        var origFB = window.FB;
        window.FB = {init: sinon.spy()};
        assert.ok(!document.querySelector('#facebook-jssdk'), 'facebook script is NOT in the DOM because load hasnt been called');
        Facebook.load(loadOptions, callbackSpy);
        assert.ok(document.querySelector('#facebook-jssdk'), 'facebook script is in the DOM when load is called');
        assert.equal(document.querySelector('#facebook-jssdk').getAttribute('src'), '//connect.facebook.net/en_US/sdk.js', 'script url is defaulted to correct path');
        assert.equal(callbackSpy.callCount, 0, 'callback is NOT fired yet because facebook hasnt loaded');
        assert.equal(window.FB.init.callCount, 0, 'FB.init() was NOT yet called');
        scriptEl.onload(); // trigger script load
        window.fbAsyncInit(); // trigger fb load
        assert.deepEqual(callbackSpy.args[0], [window.FB], 'callback is fired with the FB object when facebook is loaded');
        var FBInitOptions = window.FB.init.args[0][0];
        assert.equal(FBInitOptions.appId, loadOptions.apiConfig.appId, 'FB.init() is called with supplied appId');
        assert.equal(FBInitOptions.xfbml, true, 'object passed FB.init() includes xfbml property set to "true"');
        assert.equal(FBInitOptions.version, 'v2.1', 'object passed FB.init() includes version set to "v2.1"');
        Facebook.unload();
        createScriptElementStub.restore();
        window.FB = origFB;
    });

    it('should load the script with custom options', function () {
        var loadOptions = {
            apiConfig: {
                appId: 'your-app-id',
                xfbml: false,
                version: 'v2.5'
            },
            scriptUrl: 'my-script.js'
        };
        var scriptEl = document.createElement('script');
        var createScriptElementStub = sinon.stub(Facebook, 'createScriptElement').returns(scriptEl);
        var origFB = window.FB;
        window.FB = {init: sinon.spy()};
        Facebook.load(loadOptions);
        scriptEl.onload(); // trigger script load
        window.fbAsyncInit(); // trigger fb load
        assert.deepEqual(window.FB.init.args[0], [loadOptions.apiConfig], 'after calling load(), FB.init() is called with correct api configuration object with custom options');
        Facebook.unload();
        createScriptElementStub.restore();
        window.FB = origFB;
    });
});