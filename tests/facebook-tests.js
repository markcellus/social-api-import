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
        window.FB = {
            init: sinon.spy(),
            login: sinon.stub()
        };
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
        let facebook = new Facebook();
        facebook.load();
        assert.ok(resourceManagerLoadScriptStub.calledWith('//connect.facebook.net/en_US/sdk.js'));
        facebook.destroy();
    });

    it('should call FB.init with xfmbl set to "true" if it hasnt been specified in options when api is loaded', function (done) {
        let facebook = new Facebook();
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.xfbml, true, 'object passed FB.init() includes xfbml property set to "true"');
            facebook.destroy();
            done();
        });
    });

    it('should call FB.init with version set to "v2.1" if there is none specified when api is loaded', function (done) {
        let facebook = new Facebook();
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.version, 'v2.1', 'object passed FB.init() includes version set to "v2.1"');
            facebook.destroy();
            done();
        });
    });

    it('should call FB.init when "v[VERSION]" option when "apiVersion" number is specified when api is loaded', function (done) {
        var version = 2.5;
        let facebook = new Facebook({apiVersion: version});
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.version, 'v' + version);
            facebook.destroy();
            done();
        });
    });

    it('should call FB.init when "version" string when api is loaded', function (done) {
        var version = 'v3.5';
        let facebook = new Facebook({version: version});
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.version, version);
            facebook.destroy();
            done();
        });
    });

    it('should load the FB object with appId specified in options when api is loaded', function (done) {
        var id = 'myFacebookAppId';
        let facebook = new Facebook({appId: id});
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.appId, id);
            facebook.destroy();
            done();
        });
    });

    it('should resolve the load promise only when ResourceManager\'s loadScript method resolves and fbAsyncInit has been triggered', function (done) {
        var loadSpy = sinon.spy();
        let facebook = new Facebook();
        facebook.load().then(loadSpy);
        _.defer(() => {
            assert.equal(loadSpy.callCount, 0, 'load hasnt resolved because ResourceManager loadScript hasnt resolved');
            loadScriptTrigger.resolve();
            assert.equal(loadSpy.callCount, 0, 'load still hasnt resolved after ResourceManager loadScript is resolved because fbAsyncInit hasnt been triggered');
            window.fbAsyncInit(); // trigger api load
            _.defer(() => {
                assert.ok(loadSpy.calledWith(window.FB), 'load is resolved with FB object when fbAsyncInit is triggered');
                facebook.destroy();
                done();
            });
        });
    });

    it('passing a readFriendProfiles permission into login should pass appropriate scope permissions to the FB.login', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {authResponse: {}};
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        let facebook = new Facebook();
        return facebook.login({permissions: ['readFriendProfiles']}).then(() => {
            assert.equal(window.FB.login.args[0][1].scope, 'user_friends');
            facebook.destroy();
        });
    });

    it('passing a deletePosts permission into login should pass appropriate scope permissions to the FB.login', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {authResponse: {}};
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        let facebook = new Facebook();
        return facebook.login({permissions: ['deletePosts']}).then(() => {
            assert.equal(window.FB.login.args[0][1].scope, 'publish_actions');
            facebook.destroy();
        });
    });

    it('passing a updatePosts permission into login should pass appropriate scope permissions to the FB.login', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {authResponse: {}};
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        let facebook = new Facebook();
        return facebook.login({permissions: ['updatePosts']}).then(() => {
            assert.equal(window.FB.login.args[0][1].scope, 'publish_actions');
            facebook.destroy();
        });
    });

    it('passing a readPosts permission into login should pass appropriate scope permissions to the FB.login', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {authResponse: {}};
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        let facebook = new Facebook();
        return facebook.login({permissions: ['readPosts']}).then(() => {
            assert.equal(window.FB.login.args[0][1].scope, 'user_posts');
            facebook.destroy();
        });
    });

    it('passing a createPosts permission into login should pass appropriate scope permissions to the FB.login', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {authResponse: {}};
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        let facebook = new Facebook();
        return facebook.login({permissions: ['createPosts']}).then(() => {
            assert.equal(window.FB.login.args[0][1].scope, 'publish_actions');
            facebook.destroy();
        });
    });

    it('passing a readProfile permission into login should pass appropriate scope permission to the FB.login', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {authResponse: {}};
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        let facebook = new Facebook();
        return facebook.login({permissions: ['readProfile']}).then(() => {
            let str = window.FB.login.args[0][1].scope.split(',');
            assert.ok(str.indexOf('public_profile') > -1);
            assert.ok(str.indexOf('user_about_me') > -1);
            assert.ok(str.indexOf('user_location') > -1);
            assert.ok(str.indexOf('user_birthday') > -1);
            assert.ok(str.indexOf('user_work_history') > -1);
            facebook.destroy();
        });
    });

    it('multiple permissions passed into login should be converted to comma-seperated values to the FB.login', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {authResponse: {}};
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        // choose multiple permissions that would match different permissions
        var testPermissions = ['createPosts', 'readPosts'];
        let facebook = new Facebook();
        return facebook.login({permissions: testPermissions}).then(() => {
            assert.equal(window.FB.login.args[0][1].scope, 'publish_actions,user_posts');
            facebook.destroy();
        });
    });

    it('multiple permissions with the same mapped value passed into login should only return the mapped value once in the scope passed to FB.login', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {authResponse: {}};
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        // choose multiple permissions with same mapped value
        var testPermissions = ['createPosts', 'updatePosts'];
        let facebook = new Facebook();
        return facebook.login({permissions: testPermissions}).then(() => {
            assert.equal(window.FB.login.args[0][1].scope, 'publish_actions');
            facebook.destroy();
        });
    });

    it('should resolve login promise with appropriate object when a authResponse exists in the FB.login callback', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var resp = {
            authResponse: {
                accessToken: 'blurr',
                userId: 'blurr',
                expiresIn: Date.now()
            }
        };
        window.FB.login.yields(resp);
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        let facebook = new Facebook();
        return facebook.login().then((assertResp) => {
            assert.equal(assertResp.accessToken, resp.authResponse.accessToken);
            assert.equal(assertResp.userId, resp.authResponse.userId);
            assert.equal(assertResp.expiresAt, resp.authResponse.expiresIn);
            facebook.destroy();
        })
    });

    it('should resolve login with an empty object when an authResponse object does not exist in the FB.login callback', function (done) {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        window.FB.login.yields({});
        // ensure fbAsyncInit is called immediately
        Object.defineProperty(window, 'fbAsyncInit', {
            configurable: true,
            set: function (func) {
                func();
            }
        });
        var resolveSpy = sinon.spy();
        let facebook = new Facebook();
        facebook.login().then(resolveSpy);
        _.defer(() => {
            var firstArg = resolveSpy.args[0][0];
            assert.ok(_.isObject(firstArg));
            assert.ok(_.isEmpty(firstArg));
            facebook.destroy();
            done();
        })
    });

    it('should call ResourceManager\'s unloadScript method only when there are no other instances that exist', function () {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        let resourceManagerUnloadScriptStub = sinon.stub(ResourceManager, 'unloadScript');
        let firstFacebookInstance = new Facebook();
        let secondFacebookInstance = new Facebook();
        firstFacebookInstance.load();
        secondFacebookInstance.load();
        firstFacebookInstance.destroy();
        assert.equal(resourceManagerUnloadScriptStub.callCount, 0);
        secondFacebookInstance.destroy();
        assert.equal(resourceManagerUnloadScriptStub.callCount, 1);
        resourceManagerUnloadScriptStub.restore();
    });
});

