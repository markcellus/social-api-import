'use strict';
import Utils from './utils';
import BaseApi from './base-api';

/**
 * Twitter API-loading class.
 * @class Twitter
 */
class Twitter extends BaseApi {

    /**
     * Loads the script to the API and returns the FB object.
     * @param {Object} options - load options
     * @param {Object} options.scriptUrl - The src url of the script js file
     * @param {Object} options.apiConfig - The FB.init() options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     */
    load (options, callback) {

        this.options = Utils.extend({
            scriptUrl: 'https://platform.twitter.com/widgets.js',
            apiConfig: {}
        }, options);
        this.loadApi(callback);
    }

    /**
     * Fires callback when API has been loaded.
     * @param {Function} cb - The callback
     * @private
     */
    _handleLoadApi (cb) {
        this.loadScript(this.options.scriptUrl, 'twitter-wjs', function () {
            var t = window.twttr || {};
            t.ready = function (f) {
                t._e.push(f);
            };
            cb(t);
        });
    }
}

export default new Twitter();
