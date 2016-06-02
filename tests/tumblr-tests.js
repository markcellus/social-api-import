"use strict";
import sinon from 'sinon';
import assert from 'assert';
import Tumblr from './../src/tumblr';
import ResourceManager from 'resource-manager-js';
import _ from 'lodash';

describe('Tumblr', function () {

    let resourceManagerLoadScriptStub;
    let loadScriptTrigger = {};

    beforeEach(function () {
        resourceManagerLoadScriptStub = sinon.stub(ResourceManager, 'loadScript');
        resourceManagerLoadScriptStub.returns(new Promise((resolve) => {
            loadScriptTrigger.resolve = resolve;
        }));
    });

    afterEach(function () {
        resourceManagerLoadScriptStub.restore();
    });

    it('should call ResourceManager\'s loadScript method with the correct url to the tumblr js script', function (done) {
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        var hostname = 'blah';
        Tumblr.load({'base-hostname': hostname});
        _.defer(() => {
            var assertionUrl = '//api.tumblr.com/v2/blog/' + hostname + '/posts?api_key=&callback=onTumblrReady';
            assert.ok(resourceManagerLoadScriptStub.calledWith(assertionUrl));
            Tumblr.unload();
            done();
        });
    });

    it('should reject with error when there is no "base-hostname" option passed in load call', function (done) {
        var loadSpy = sinon.stub(Tumblr, 'load');
        Tumblr.load();
        assert.ok(loadSpy.throws());
        Tumblr.unload();
        loadSpy.restore();
        done();
    });

    it('should resolve the load promise only when ResourceManager\'s loadScript method resolves and the "onTumblrReady" callback is triggered', function (done) {
        var loadSpy = sinon.spy();
        Tumblr.load({'base-hostname': 'test'}).then(loadSpy);
        _.defer(() => {
            assert.equal(loadSpy.callCount, 0);
            loadScriptTrigger.resolve(); // trigger load script
            assert.equal(loadSpy.callCount, 0);
            _.defer(() => {
                window.onTumblrReady(); // trigger callback
                _.defer(() => {
                    assert.ok(loadSpy.calledOnce);
                    Tumblr.unload();
                    done();
                });
            });
        });
    });

});
