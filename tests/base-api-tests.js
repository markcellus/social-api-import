var sinon = require('sinon');
var assert = require('assert');
var BaseApi = require('./../src/base-api');

describe('Base API', function () {
    it('should inject script correctly', function () {
        var mockScriptEl = document.createElement('script');
        var createScriptElementStub = sinon.stub(BaseApi.prototype, 'createScriptElement').returns(mockScriptEl);
        var baseApi = new BaseApi();
        var id = 'myScript0';
        var filePath =  'path/to/my/script.js';
        var cbSpy = sinon.spy();
        assert.equal(document.querySelectorAll('#' + id).length, 0, 'before loadScript() is called, new script tag has not yet been injected into the DOM');
        baseApi.loadScript(filePath, id, cbSpy);
        assert.equal(document.querySelectorAll('#' + id).length, 1, 'after first call to loadScript(), script is injected into the DOM');
        assert.equal(cbSpy.callCount, 0, 'callback is NOT triggered because script hasnt yet loaded');
        var secondCbSpy = sinon.spy();
        baseApi.loadScript(filePath, id, secondCbSpy);
        assert.equal(document.querySelectorAll('#' + id).length, 1, 'after second call to loadScript(), script is not injected into the DOM a second time');
        assert.equal(cbSpy.callCount, 0, 'first callback is NOT triggered because script hasnt yet loaded');
        assert.equal(secondCbSpy.callCount, 0, 'second callback is NOT triggered');
        mockScriptEl.onload(); // trigger script injection complete
        assert.equal(cbSpy.callCount, 1, 'after script has loaded, first callback is triggered');
        assert.equal(secondCbSpy.callCount, 1, 'second callback is triggered');
        var thirdCallbackSpy = sinon.spy();
        baseApi.loadScript(filePath, id, thirdCallbackSpy);
        assert.equal(thirdCallbackSpy.callCount, 1, 'after calling loadScript() after the script has loaded, callback is triggered immediately');
        baseApi.unload();
        assert.equal(document.querySelectorAll('#' + id).length, 0, 'after unload(), script is no longer in DOM');
        createScriptElementStub.restore();
    });
});