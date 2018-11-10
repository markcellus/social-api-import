import sinon from 'sinon';
import chai from 'chai';
import Twitter from '../src/twitter';
import _ from 'lodash';
import { script } from 'dynamic-import';

const { assert } = chai;
describe('Twitter', function () {

    let origTwttr;
    let scriptImportStub;
    let loadScriptTrigger = {};

    beforeEach(function () {
        origTwttr = window.twttr;
        scriptImportStub = sinon.stub(script, 'import');
        scriptImportStub.returns(new Promise((resolve) => {
            loadScriptTrigger.resolve = resolve;
        }));
    });

    afterEach(function () {
        window.twttr = origTwttr;
        scriptImportStub.restore();
    });

    it('should call script import method when load is called', function (done) {
        let twitter = new Twitter();
        twitter.load();
        _.defer(() => {
            assert.ok(scriptImportStub.calledWith('https://platform.twitter.com/widgets.js'));
            twitter.destroy();
            done();
        });
    });

    it('should resolve the load promise only when script import method resolves and the twitter api triggers our ready method in the queue', function (done) {
        let twitter = new Twitter();
        var loadSpy = sinon.spy();
        twitter.load().then(loadSpy);
        _.defer(() => {
            assert.equal(loadSpy.callCount, 0);
            // trigger load script resolve
            loadScriptTrigger.resolve();
            assert.equal(loadSpy.callCount, 0);
            _.defer(() => {
                window.twttr._e[0](window.twttr);
                _.defer(() => {
                    assert.ok(loadSpy.calledWith(window.twttr));
                    twitter.destroy();
                    done();
                });
            });
        });
    });

});
