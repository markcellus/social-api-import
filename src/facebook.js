'use strict';
import Utils from './utils';
import BaseApi from './base-api';

/**
 * Facebook API class.
 * @class Facebook
 */
class Facebook extends BaseApi {

    /**
     * Loads the script to the API and returns the FB object.
     * @param {Object} options - load options
     * @param {Object} options.scriptUrl - The src url of the script js file
     * @param {Object} options.apiConfig - The FB.init() options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     */
    load (options, callback) {

        options = Utils.extend({
            scriptUrl: '//connect.facebook.net/en_US/sdk.js',
            apiConfig: {}
        }, options);

        options.apiConfig.version = options.apiConfig.version || 'v2.1';
        options.apiConfig.xfbml = options.apiConfig.xfbml || true;

        this.options = options;

        this.loadApi(callback);
    }

    /**
     * Handles loading the API.
     * @param cb
     * @private
     */
    _handleLoadApi (cb) {
        window.fbAsyncInit = function () {
            FB.init(this.options.apiConfig);
            cb(FB);
        }.bind(this);
        this.loadScript(this.options.scriptUrl, 'facebook-jssdk');
    }

}

export default new Facebook();
