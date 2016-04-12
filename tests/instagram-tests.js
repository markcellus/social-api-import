'use strict';
import sinon from 'sinon';
import assert from 'assert';
import Instagram from './../src/instagram';

describe('Instagram', function () {

    it('should load script correctly and pass back instagram window object', function () {
        var cbSpy = sinon.spy();
        var mockScriptEl = document.createElement('script');
        var createScriptElementStub = sinon.stub(Instagram, 'createScriptElement').returns(mockScriptEl);
        var testOptions = {};
        Instagram.load(testOptions, cbSpy);
        var origInstagramWindowObj = window.instgrm;
        window.instgrm = {Embeds: {process: sinon.spy()}};
        mockScriptEl.onload(); // trigger script loaded
        assert.deepEqual(cbSpy.args[0][0], window.instgrm);
        Instagram.unload();
        createScriptElementStub.restore();
        window.instgrm = origInstagramWindowObj;
    });

    it('should call process method on instagram window object when loaded', function () {
        var cbSpy = sinon.spy();
        var mockScriptEl = document.createElement('script');
        var createScriptElementStub = sinon.stub(Instagram, 'createScriptElement').returns(mockScriptEl);
        assert.equal(document.querySelectorAll('#twitter-wjs').length, 0, 'before load() is called, new script tag has not yet been injected into the DOM');
        var testOptions = {};
        Instagram.load(testOptions, cbSpy);
        var origInstagramWindowObj = window.instgrm;
        window.instgrm = {Embeds: {process: sinon.spy()}};
        assert.equal(window.instgrm.Embeds.process.callCount, 0, 'window object process method was not yet called because script hasnt been loaded yet');
        mockScriptEl.onload(); // trigger script loaded
        assert.equal(window.instgrm.Embeds.process.callCount, 1, 'window object process method is called once script has loaded');
        Instagram.unload();
        createScriptElementStub.restore();
        window.instgrm = origInstagramWindowObj;
    });


});
