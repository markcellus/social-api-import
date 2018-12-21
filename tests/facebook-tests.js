import sinon from 'sinon';
import Facebook from '../src/facebook';
import { script } from 'dynamic-import';
import _ from 'lodash';
import chai from 'chai';
const { assert } = chai;

describe('Facebook', function() {
    let origFB;
    let scriptImportStub;
    let loadScriptTrigger = {};

    beforeEach(function() {
        origFB = window.FB;
        window.FB = {
            init: sinon.spy(),
            login: sinon.stub()
        };
        scriptImportStub = sinon.stub(script, 'import');
        scriptImportStub.returns(
            new Promise(resolve => {
                loadScriptTrigger.resolve = resolve;
            })
        );
    });

    afterEach(function() {
        window.FB = origFB;
        scriptImportStub.restore();
    });

    it('should call script import method with the correct url to the facebook js script', function() {
        let facebook = new Facebook({});
        facebook.load();
        assert.deepEqual(scriptImportStub.args[0], ['https://connect.facebook.net/en_US/sdk.js']);
        facebook.destroy();
    });

    it('should call FB.init with xfmbl set to "true" if it hasnt been specified in options when api is loaded', function(done) {
        let facebook = new Facebook({});
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.xfbml, true, 'object passed FB.init() includes xfbml property set to "true"');
            facebook.destroy();
            done();
        });
    });

    it('should call FB.init when "v[VERSION]" option when "version" number is specified when api is loaded', function(done) {
        var version = '2.5';
        let facebook = new Facebook({ version });
        debugger;
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.version, 'v' + version);
            facebook.destroy();
            done();
        });
    });

    it('should call FB.init when "v[VERSION]" option when "apiVersion" number is specified when api is loaded', function(done) {
        var version = 2.5;
        let facebook = new Facebook({ apiVersion: version });
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.version, 'v' + version);
            facebook.destroy();
            done();
        });
    });

    it('should call FB.init when "version" string when api is loaded', function(done) {
        var version = 'v3.5';
        let facebook = new Facebook({ version: version });
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.version, version);
            facebook.destroy();
            done();
        });
    });

    it('should load the FB object with appId specified in options when api is loaded', function(done) {
        var id = 'myFacebookAppId';
        let facebook = new Facebook({ appId: id });
        facebook.load();
        _.defer(() => {
            window.fbAsyncInit(); //trigger api load
            var FBInitOptions = window.FB.init.args[0][0];
            assert.equal(FBInitOptions.appId, id);
            facebook.destroy();
            done();
        });
    });

    it('should resolve the load promise only when script import method resolves and fbAsyncInit has been triggered', function(done) {
        var loadSpy = sinon.spy();
        let facebook = new Facebook({});
        facebook.load().then(loadSpy);
        _.defer(() => {
            assert.equal(loadSpy.callCount, 0, 'load hasnt resolved because ResourceManager loadScript hasnt resolved');
            loadScriptTrigger.resolve();
            assert.equal(
                loadSpy.callCount,
                0,
                'load still hasnt resolved after ResourceManager loadScript is resolved because fbAsyncInit hasnt been triggered'
            );
            window.fbAsyncInit(); // trigger api load
            _.defer(() => {
                assert.ok(
                    loadSpy.calledWith(window.FB),
                    'load is resolved with FB object when fbAsyncInit is triggered'
                );
                facebook.destroy();
                done();
            });
        });
    });

    it('should call script unload method only when there are no other instances that exist', function() {
        scriptImportStub.returns(Promise.resolve());
        let scriptUnloadStub = sinon.stub(script, 'unload');
        let firstFacebookInstance = new Facebook({});
        let secondFacebookInstance = new Facebook({});
        firstFacebookInstance.load();
        secondFacebookInstance.load();
        firstFacebookInstance.destroy();
        assert.equal(scriptUnloadStub.callCount, 0);
        secondFacebookInstance.destroy();
        assert.equal(scriptUnloadStub.callCount, 1);
        scriptUnloadStub.restore();
    });
});
