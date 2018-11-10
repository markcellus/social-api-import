import sinon from 'sinon';
import chai from 'chai';
import Instagram from '../src/instagram';
import { script } from 'dynamic-import';
import _ from 'lodash';

const { assert } = chai;
describe('Instagram', function () {

    let origInstgrm;
    let scriptImportStub;
    let loadScriptTrigger = {};

    beforeEach(function () {
        origInstgrm = window.instgrm;
        window.instgrm = {
            Embeds: {
                process: sinon.spy()
            }
        };
        scriptImportStub = sinon.stub(script, 'import');
        scriptImportStub.returns(new Promise((resolve) => {
            loadScriptTrigger.resolve = resolve;
        }));
    });

    afterEach(function () {
        window.instgrm = origInstgrm;
        scriptImportStub.restore();
    });

    it('should call script import method when load is called', function (done) {
        let instagram = new Instagram();
        instagram.load();
        _.defer(() => {
            assert.ok(scriptImportStub.calledWith('//platform.instagram.com/en_US/embeds.js'));
            instagram.destroy();
            done();
        });
    });

    it('should call process method on instagram window object when script is loaded', function (done) {
        // ensure script is loaded immediately
        scriptImportStub.returns(Promise.resolve());
        let instagram = new Instagram();
        instagram.load();
        _.defer(() => {
            assert.ok(window.instgrm.Embeds.process.calledOnce);
            instagram.destroy();
            done();
        })
    });


    it('should resolve load call with instgrm object when script is loaded', function (done) {
        var loadSpy = sinon.spy();
        let instagram = new Instagram();
        instagram.load().then(loadSpy);
        assert.ok(loadSpy.notCalled);
        _.defer(() => {
            loadScriptTrigger.resolve(); // trigger script load
            _.defer(() => {
                assert.ok(loadSpy.calledWith(window.instgrm));
                instagram.destroy();
                done();
            });
        })
    });


});
