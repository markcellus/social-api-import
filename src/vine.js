'use strict';

var Utils = require('./utils');
var BaseApi = require('./base-api');

/**
 * Vine API-loading class.
 * @class Vine
 */
var Vine = function () {
    this.initialize();
};
Vine.prototype = Utils.extend({}, BaseApi.prototype, {

    /**
     * Loads the Vine API.
     * @param {Object} options - load options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     */
    load: function (options, callback) {

        this.options = Utils.extend({
            scriptUrl: '//platform.vine.co/static/scripts/embed.js'
        }, options);

        this.loadApi(callback);
    },

    /**
     * Fires callback when API has been loaded.
     * @param {Function} cb - The callback
     * @private
     */
    _handleLoadApi: function (cb) {
        this.loadScript(this.options.scriptUrl, 'vine-js', cb);
    }

});

module.exports = window.SocialApi.Vine = new Vine();
