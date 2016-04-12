'use strict';
import sinon from 'sinon';
import assert from 'assert';
import Vine from './../src/vine';
import BaseApi from './../src/base-api';

describe('Vine', function () {

    it('should call BaseApi\'s loadApi with callback passed to load call', function () {
        var cbSpy = sinon.spy();
        var baseApiLoadStub = sinon.stub(BaseApi.prototype, 'loadApi');
        var baseApiUnLoadStub = sinon.stub(BaseApi.prototype, 'unload');
        var testOptions = {};
        Vine.load(testOptions, cbSpy);
        assert.equal(baseApiLoadStub.args[0][0], cbSpy);
        Vine.unload();
        baseApiUnLoadStub.restore();
        baseApiLoadStub.restore();
    });

});
