'use strict';
import Utils from './utils';
import BaseApi from './base-api';

/**
 * Tumblr API-loading class.
 * @class Tumblr
 */
class Tumblr extends BaseApi {

    /**
     * Loads the script to the API.
     * @param {Object} options - load options
     * @param {Object} options.apiConfig - The Tumblr api options
     * @param {Object} options.apiConfig.base-hostname - The base-hostname
     * @param {Object} options.apiConfig.api_key - API key
     * @param {Function} [callback] - Fires when the FB SDK has been loaded
     */
    load (options, callback) {
        this.onReadyCallback = 'onTumblrReady';

        options = Utils.extend({
            apiConfig: {}
        }, options);

        if (!options.apiConfig['base-hostname']) {
            return console.error('Tumblr load() method needs to be passed a "base-hostname"');
        }

        options.apiConfig.api_key = options.apiConfig.api_key || '';

        this.options = options;

        this.loadApi(callback);
    }

    /**
     * Fires callback when API has been loaded.
     * @param {Function} cb - The callback
     * @private
     */
    _handleLoadApi (cb) {
        var options = this.options;
        options.scriptUrl = '//api.tumblr.com/v2/blog/' + options.apiConfig['base-hostname'] + '/?' +
        'api_key=' + options.apiConfig.api_key + '&' +
        'callback=' + this.onReadyCallback;
        window[this.onReadyCallback] = cb;
        this.loadScript(options.scriptUrl, 'tumblr-lscript');
    }

    /**
     * Makes an API call for latest posts and returns them in a standard block of html.
     * @param url
     * @param options
     * @param callback
     */
    getPostsEmbed (url, options, callback) {

        var request = new XMLHttpRequest(),
            err,
            onComplete = function (err) {
                callback ? callback(err) : null;
            };

        if (typeof options === 'function') {
            options = callback;
        }

        // add api key to call
        url += '?api_key=' + this.options.apiConfig.api_key + '&jsonp=';

        request.open('GET', url, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var data = JSON.parse(request.responseText);
            } else {
                // error
                err = request
            }
            onComplete(err);
        };
        request.onerror = function () {
            console.log('error occurred');
            console.log(arguments);
        };
        request.send();
    }

}

export default new Tumblr();
