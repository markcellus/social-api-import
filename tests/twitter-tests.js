'use strict';
import sinon from 'sinon';
import assert from 'assert';
import Twitter from './../src/twitter';
import _ from 'lodash';
import ResourceManager from 'resource-manager-js';
import {Promise} from 'es6-promise';

describe('Twitter', function () {

    let origTwttr;
    let resourceManagerLoadScriptStub;
    let loadScriptTrigger = {};

    beforeEach(function () {
        origTwttr = window.twttr;
        resourceManagerLoadScriptStub = sinon.stub(ResourceManager, 'loadScript');
        resourceManagerLoadScriptStub.returns(new Promise((resolve) => {
            loadScriptTrigger.resolve = resolve;
        }));
    });

    afterEach(function () {
        window.twttr = origTwttr;
        resourceManagerLoadScriptStub.restore();
    });

    it('should call ResourceManager\'s loadScript method when load is called', function (done) {
        Twitter.load();
        _.defer(() => {
            assert.ok(resourceManagerLoadScriptStub.calledWith('https://platform.twitter.com/widgets.js'));
            Twitter.unload();
            done();
        });
    });

    it('should resolve the load promise only when ResourceManager\'s loadScript method resolves and the twitter api triggers our ready method in the queue', function (done) {
        var loadSpy = sinon.spy();
        Twitter.load().then(loadSpy);
        _.defer(() => {
            assert.equal(loadSpy.callCount, 0);
            // trigger load script resolve
            loadScriptTrigger.resolve();
            assert.equal(loadSpy.callCount, 0);
            _.defer(() => {
                window.twttr._e[0](window.twttr);
                _.defer(() => {
                    assert.ok(loadSpy.calledWith(window.twttr));
                    Twitter.unload();
                    done();
                });
            });
        });
    });

});
