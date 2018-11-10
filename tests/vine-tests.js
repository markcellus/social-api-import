import sinon from 'sinon';
import chai from 'chai';
import Vine from '../src/vine';
import { script } from 'dynamic-import';

const { assert } = chai;
describe('Vine', function () {

    it('should call script import method with the correct url to the vine js script', function () {
        let scriptImportStub = sinon.stub(script, 'import');
        scriptImportStub.returns(Promise.resolve());
        let vine = new Vine();
        return vine.load().then(() => {
            assert.ok(scriptImportStub.calledWith('//platform.vine.co/static/scripts/embed.js'));
            vine.destroy();
            scriptImportStub.restore();
        });
    });

});
