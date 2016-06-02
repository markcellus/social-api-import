'use strict';
import sinon from 'sinon';
import assert from 'assert';
import Vine from './../src/vine';
import {Promise} from 'es6-promise';
import ResourceManager from 'resource-manager-js';

describe('Vine', function () {

    it('should call ResourceManager\'s loadScript method with the correct url to the vine js script', function () {
        let resourceManagerLoadScriptStub = sinon.stub(ResourceManager, 'loadScript');
        resourceManagerLoadScriptStub.returns(Promise.resolve());
        return Vine.load().then(() => {
            assert.ok(resourceManagerLoadScriptStub.calledWith('//platform.vine.co/static/scripts/embed.js'));
            Vine.unload();
            resourceManagerLoadScriptStub.restore();
        });
    });

});
