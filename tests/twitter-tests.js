'use strict';
import sinon from 'sinon';
import assert from 'assert';
import Twitter from './../src/twitter';

describe('Twitter', function () {

    it('should load script correctly', function () {
        var cbSpy = sinon.spy();
        var mockScriptEl = document.createElement('script');
        var createScriptElementStub = sinon.stub(Twitter, 'createScriptElement').returns(mockScriptEl);
        assert.equal(document.querySelectorAll('#twitter-wjs').length, 0, 'before load() is called, new script tag has not yet been injected into the DOM');
        var testOptions = {};
        Twitter.load(testOptions, cbSpy);
        var secondCbSpy = sinon.spy();
        Twitter.load(testOptions, secondCbSpy);
        assert.equal(document.querySelectorAll('#twitter-wjs').length, 1, 'after first call to load(), tumblr script is loaded into the DOM');
        assert.equal(cbSpy.callCount, 0, 'callback is NOT triggered because script hasnt yet loaded');
        mockScriptEl.onload(); // trigger script loaded
        assert.equal(cbSpy.callCount, 1, 'after API has loaded, first callback is triggered');
        assert.equal(secondCbSpy.callCount, 1, 'second callback is triggered');
        Twitter.unload();
        assert.equal(document.querySelectorAll('#twitter-wjs').length, 0, 'when unload() is called, script tag is removed from the DOM');
        createScriptElementStub.restore();
    });

});
