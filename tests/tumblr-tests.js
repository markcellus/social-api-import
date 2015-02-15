define([
    'sinon',
    'qunit',
    'src/tumblr'
], function(
    Sinon,
    QUnit,
    Tumblr
){
    "use strict";

    QUnit.module('Tumblr Tests');

    QUnit.test('script loading', function () {
        QUnit.expect(5);
        var fixture = document.getElementById('qunit-fixture');
        var cbSpy = Sinon.spy();
        var mockScriptEl = document.createElement('script');
        var createScriptElementStub = Sinon.stub(Tumblr, 'createScriptElement').returns(mockScriptEl);
        QUnit.equal(document.querySelectorAll('#tumblr-lscript').length, 0, 'before load() is called, new script tag has not yet been injected into the DOM');
        var baseHostName = 'blah2';
        var apiKey = 'myAPIKeeee';
        var testOptions = {apiConfig: {'base-hostname': baseHostName, 'api_key': apiKey}};
        Tumblr.load(testOptions, cbSpy);
        var secondCbSpy = Sinon.spy();
        Tumblr.load(testOptions, secondCbSpy);
        QUnit.equal(document.querySelectorAll('#tumblr-lscript').length, 1, 'after first call to load(), tumblr script is loaded into the DOM');
        QUnit.equal(cbSpy.callCount, 0, 'callback is NOT triggered because script hasnt yet loaded');
        Tumblr._triggerScriptLoaded(); // trigger script loaded
        QUnit.equal(cbSpy.callCount, 1, 'after script has loaded, first callback is triggered');
        QUnit.equal(secondCbSpy.callCount, 1, 'second callback is triggered');
        Tumblr.unload();
        createScriptElementStub.restore();
    });

});