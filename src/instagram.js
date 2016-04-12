'use strict';
import Utils from './utils';
import BaseApi from './base-api';

/**
 * Instagram API-loading class.
 * @class Instagram
 */
class Instagram extends BaseApi {

    /**
     * Loads the script to the API and returns the FB object.
     * @param {Object} options - load options
     * @param {Object} options.scriptUrl - The src url of the script js file
     * @param {Object} options.apiConfig - The FB.init() options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     */
    load (options, callback) {

        this.options = Utils.extend({
            scriptUrl: '//platform.instagram.com/en_US/embeds.js',
            apiConfig: {}
        }, options);

        this.loadApi(callback);
    }

    /**
     * Handles loading the API.
     * @param cb
     * @private
     */
    _handleLoadApi (cb) {
        this.loadScript(this.options.scriptUrl, 'instagram-sdk', function () {
            // must manually process instagram embed
            window.instgrm.Embeds.process();
            cb(window.instgrm);
        });
    }

}

export default new Instagram();
