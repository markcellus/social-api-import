'use strict';
import sinon from 'sinon';
import assert from 'assert';
import Facebook from './../src/facebook';
import ResourceManager from 'resource-manager-js';
import _ from 'lodash';
import {Promise} from 'es6-promise';

describe('Facebook', function () {

    let origFB;
    let resourceManagerLoadScriptStub;
    let loadScriptTrigger = {};

    beforeEach(function () {
        origFB = window.FB;
        window.FB = {init: sinon.spy()};
        resourceManagerLoadScriptStub = sinon.stub(ResourceManager, 'loadScript');
        resourceManagerLoadScriptStub.returns(new Promise((resolve) => {
            loadScriptTrigger.resolve = resolve;
        }));
    });

    afterEach(function () {
        window.FB = origFB;
        resourceManagerLoadScriptStub.restore();
    });

    it('should call ResourceManager\'s loadScript method with the correct url to the facebook js script', function () {
        Facebook.load();
        assert.ok(resourceManagerLoadScriptStub.calledWith('//connect.facebook.net/en_US/sdk.js'));
        Facebook.unload();
    });

    it('should load the FB object with default options when api is loaded', function (done) {
        Facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.xfbml, true, 'object passed FB.init() includes xfbml property set to "true"');
            assert.equal(FBInitOptions.version, 'v2.1', 'object passed FB.init() includes version set to "v2.1"');
            Facebook.unload();
            done();
        });
    });

    it('should load the FB object with appId specified in options when api is loaded', function (done) {
        var id = 'myFacebookAppId';
        Facebook.load({appId: id});
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.appId, id);
            Facebook.unload();
            done();
        });
    });

    it('should resolve the load promise only when ResourceManager\'s loadScript method resolves and fbAsyncInit has been triggered', function (done) {
        var loadSpy = sinon.spy();
        Facebook.load().then(loadSpy);
        _.defer(() => {
            assert.equal(loadSpy.callCount, 0, 'load hasnt resolved because ResourceManager loadScript hasnt resolved');
            loadScriptTrigger.resolve();
            assert.equal(loadSpy.callCount, 0, 'load still hasnt resolved after ResourceManager loadScript is resolved because fbAsyncInit hasnt been triggered');
            window.fbAsyncInit(); // trigger api load
            _.defer(() => {
                assert.ok(loadSpy.calledWith(window.FB), 'load is resolved with FB object when fbAsyncInit is triggered');
                Facebook.unload();
                done();
            });
        });
    });
});
