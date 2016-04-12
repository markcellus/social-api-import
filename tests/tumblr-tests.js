import sinon from 'sinon';
import assert from 'assert';
import Tumblr from './../src/tumblr';

describe('Tumblr', function () {

    it('should load script correctly', function () {
        var cbSpy = sinon.spy();
        var mockScriptEl = document.createElement('script');
        var createScriptElementStub = sinon.stub(Tumblr, 'createScriptElement').returns(mockScriptEl);
        assert.equal(document.querySelectorAll('#tumblr-lscript').length, 0, 'before load() is called, new script tag has not yet been injected into the DOM');
        var baseHostName = 'blah2';
        var apiKey = 'myAPIKeeee';
        var testOptions = {apiConfig: {'base-hostname': baseHostName, 'api_key': apiKey}};
        Tumblr.load(testOptions, cbSpy);
        var secondCbSpy = sinon.spy();
        Tumblr.load(testOptions, secondCbSpy);
        assert.equal(document.querySelectorAll('#tumblr-lscript').length, 1, 'after first call to load(), tumblr script is loaded into the DOM');
        assert.equal(cbSpy.callCount, 0, 'callback is NOT triggered because script hasnt yet loaded');
        mockScriptEl.onload(); // trigger script loaded
        assert.equal(cbSpy.callCount, 0, 'after script has loaded, first callback is NOT triggered because API hasnt loaded');
        assert.equal(secondCbSpy.callCount, 0, 'second callback is triggered is NOT triggered because API hasnt loaded');
        window[Tumblr.onReadyCallback](); // trigger API load
        assert.equal(cbSpy.callCount, 1, 'after API has loaded, first callback is triggered');
        assert.equal(secondCbSpy.callCount, 1, 'second callback is triggered');
        Tumblr.unload();
        assert.equal(document.querySelectorAll('#tumblr-lscript').length, 0, 'when unload() is called, script tag is removed from the DOM');
        createScriptElementStub.restore();
    });

});
