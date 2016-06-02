'use strict';
import BaseApi from './base-api';
import {Promise} from 'es6-promise';

/**
 * Tumblr API-loading class.
 * @class Tumblr
 */
class Tumblr extends BaseApi {

    /**
     * Loads the script to the Tumblr API.
     * @param {Object} options - Tumblr API options
     * @param {Object} options.base-hostname - The base-hostname
     * @param {Object} [options.api_key] - API key
     * @returns {Promise} Returns a promise that resolves when the Tumblr API has been loaded
     */
    load (options = {}) {
        if (!options['base-hostname']) {
            throw Error('Tumblr load() method needs to be passed a "base-hostname"');
        }
        options.api_key = options.api_key || '';
        return super.load(options);
    }
    
    /**
     * Fires callback when API has been loaded.
     * @param {Object} options - The API options
     * @private
     */
    _handleLoadApi (options) {
        let callbackMethod = 'onTumblrReady';

        // we're arbitrarily choosing the "/posts" endpoint to prevent getting a 404 error
        let scriptUrl =
            '//api.tumblr.com/v2/blog/' + options['base-hostname'] + '/posts?' +
            'api_key=' + options.api_key + '&' +
            'callback=' + callbackMethod;

        return new Promise((resolve) => {
            window[callbackMethod] = function () {
                resolve();
            };
            this._loadScript(scriptUrl);
        })
    }

}

export default new Tumblr();
