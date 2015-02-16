'use strict';

var Utils = require('./utils');
var BaseApi = require('./base-api');

/**
 * Instagram API-loading class.
 * @class Instagram
 */
var Instagram = function () {
    this.initialize();
};
Instagram.prototype = Utils.extend({}, BaseApi.prototype, {

    /**
     * Loads the script to the API and returns the FB object.
     * @param {Object} options - load options
     * @param {Object} options.scriptUrl - The src url of the script js file
     * @param {Object} options.apiConfig - The FB.init() options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     */
    load: function (options, callback) {

        this.options = Utils.extend({
            scriptUrl: '//platform.instagram.com/en_US/embeds.js',
            apiConfig: {}
        }, options);

        this.loadApi(callback);
    },

    /**
     * Handles loading the API.
     * @param cb
     * @private
     */
    _handleLoadApi: function (cb) {
        this.loadScript(this.options.scriptUrl, 'instagram-sdk', cb);
    }

});

module.exports = window.SocialApi.Instagram = new Instagram();