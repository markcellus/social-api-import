'use strict';

var Utils = require('./utils');
var BaseApi = require('./base-api');

/**
 * Facebook API class.
 * @class Facebook
 */
var Facebook = function () {
    this.initialize();
};

Facebook.prototype = Utils.extend({}, BaseApi.prototype, {

    /**
     * Loads the script to the API and returns the FB object.
     * @param {Object} options - load options
     * @param {Object} options.scriptUrl - The src url of the script js file
     * @param {Object} options.apiConfig - The FB.init() options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     */
    load: function (options, callback) {

        options = Utils.extend({
            scriptUrl: '//connect.facebook.net/en_US/sdk.js',
            apiConfig: {}
        }, options);

        options.apiConfig.version = options.apiConfig.version || 'v2.1';
        options.apiConfig.xfbml = options.apiConfig.xfbml || true;

        this.options = options;

        this.loadScript(options.scriptUrl, 'facebook-jssdk', function () {
            this.loadApi(callback);
        }.bind(this));
    },

    /**
     * Handles loading the API.
     * @param cb
     * @private
     */
    _handleLoadApi: function (cb) {
        window.fbAsyncInit = function () {
            FB.init(this.options.apiConfig);
            cb(FB);
        }.bind(this);
    }

});

module.exports = window.SocialApi.Facebook = new Facebook();
