"use strict";
import sinon from 'sinon';
import chai from 'chai';
import Tumblr from '../src/tumblr';
import { script } from 'dynamic-import';
import _ from 'lodash';

const { assert } = chai;

describe('Tumblr', function () {

    let scriptImportStub;
    let loadScriptTrigger = {};

    beforeEach(function () {
        scriptImportStub = sinon.stub(script, 'import');
        scriptImportStub.returns(new Promise((resolve) => {
            loadScriptTrigger.resolve = resolve;
        }));
    });

    afterEach(function () {
        scriptImportStub.restore();
    });

    it('should call script import method with the correct url to the tumblr js script', function (done) {
        scriptImportStub.returns(Promise.resolve());
        var hostname = 'blah';
        let tumblr = new Tumblr({'base-hostname': hostname});
        tumblr.load();
        _.defer(() => {
            var assertionUrl = '//api.tumblr.com/v2/blog/' + hostname + '/posts?api_key=&callback=onTumblrReady';
            assert.ok(scriptImportStub.calledWith(assertionUrl));
            tumblr.destroy();
            done();
        });
    });

    it('should throw error when there is no "base-hostname" option passed in constructor', function (done) {
        assert.throws(() => new Tumblr(), Error);
        done();
    });

    it('should resolve the load promise only when script import method resolves and the "onTumblrReady" callback is triggered', function (done) {
        var loadSpy = sinon.spy();
        let tumblr = new Tumblr({'base-hostname': 'test'});
        tumblr.load().then(loadSpy);
        _.defer(() => {
            assert.equal(loadSpy.callCount, 0);
            loadScriptTrigger.resolve(); // trigger load script
            assert.equal(loadSpy.callCount, 0);
            _.defer(() => {
                window.onTumblrReady(); // trigger callback
                _.defer(() => {
                    assert.ok(loadSpy.calledOnce);
                    tumblr.destroy();
                    done();
                });
            });
        });
    });

});
