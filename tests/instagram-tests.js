'use strict';
import sinon from 'sinon';
import assert from 'assert';
import Instagram from './../src/instagram';
import ResourceManager from 'resource-manager-js';
import _ from 'lodash';

describe('Instagram', function () {

    let origInstgrm;
    let resourceManagerLoadScriptStub;
    let loadScriptTrigger = {};

    beforeEach(function () {
        origInstgrm = window.instgrm;
        window.instgrm = {
            Embeds: {
                process: sinon.spy()
            }
        };
        resourceManagerLoadScriptStub = sinon.stub(ResourceManager, 'loadScript');
        resourceManagerLoadScriptStub.returns(new Promise((resolve) => {
            loadScriptTrigger.resolve = resolve;
        }));
    });

    afterEach(function () {
        window.instgrm = origInstgrm;
        resourceManagerLoadScriptStub.restore();
    });

    it('should call ResourceManager\'s loadScript method when load is called', function (done) {
        Instagram.load();
        _.defer(() => {
            assert.ok(resourceManagerLoadScriptStub.calledWith('//platform.instagram.com/en_US/embeds.js'));
            Instagram.unload();
            done();
        });
    });

    it('should call process method on instagram window object when script is loaded', function (done) {
        // ensure script is loaded immediately
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        Instagram.load();
        _.defer(() => {
            assert.ok(window.instgrm.Embeds.process.calledOnce);
            Instagram.unload();
            done();
        })
    });


    it('should resolve load call with instgrm object when script is loaded', function (done) {
        var loadSpy = sinon.spy();
        Instagram.load().then(loadSpy);
        assert.ok(loadSpy.notCalled);
        _.defer(() => {
            loadScriptTrigger.resolve(); // trigger script load
            _.defer(() => {
                assert.ok(loadSpy.calledWith(window.instgrm));
                Instagram.unload();
                done();
            });
        })
    });


});
