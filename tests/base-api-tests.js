define([
    'sinon',
    'qunit',
    'src/base-api'
], function(
    Sinon,
    QUnit,
    BaseApi
){
    "use strict";

    QUnit.module('Base API Tests');

    QUnit.test('script injection', function () {
        QUnit.expect(11);
        var fixture = document.getElementById('qunit-fixture');
        var cbSpy = Sinon.spy();
        var mockScriptEl = document.createElement('script');
        var createScriptElementStub = Sinon.stub(BaseApi.prototype, 'createScriptElement').returns(mockScriptEl);
        var baseApi = new BaseApi();
        var id = 'myScript0';
        var filePath =  'path/to/my/script.js';
        QUnit.equal(document.querySelectorAll('#' + id).length, 0, 'before injectScript() is called, new script tag has not yet been injected into the DOM');
        baseApi.injectScript(filePath, id, cbSpy);
        QUnit.equal(document.querySelectorAll('#' + id).length, 1, 'after first call to injectScript(), script is injected into the DOM');
        QUnit.equal(cbSpy.callCount, 0, 'after script has been injected, callback is NOT triggered because script hasnt yet loaded');
        var secondCbSpy = Sinon.spy();
        baseApi.injectScript(filePath, id, secondCbSpy);
        QUnit.equal(document.querySelectorAll('#' + id).length, 1, 'after second call to injectScript(), script is not injected into the DOM a second time');
        QUnit.equal(cbSpy.callCount, 0, 'callback is NOT triggered because script hasnt yet loaded');
        mockScriptEl.onload(); // trigger script injection complete
        QUnit.equal(cbSpy.callCount, 0, 'after script has successfully been injected into DOM, callback is still NOT triggered because script hasnt yet loaded');
        QUnit.equal(secondCbSpy.callCount, 0, 'second callback still hasnt been triggered');
        baseApi._triggerScriptLoaded(); // trigger script loaded
        QUnit.equal(cbSpy.callCount, 1, 'after script has loaded, first callback is triggered');
        QUnit.equal(secondCbSpy.callCount, 1, 'second callback is triggered');
        var thirdCallbackSpy = Sinon.spy();
        baseApi.injectScript(filePath, id, thirdCallbackSpy);
        QUnit.equal(thirdCallbackSpy.callCount, 1, 'after calling injectScript() after the script has loaded, callback is triggered immediately');
        baseApi.unload();
        QUnit.equal(document.querySelectorAll('#' + id).length, 0, 'after unload(), script is no longer in DOM');
        createScriptElementStub.restore();
    });

});