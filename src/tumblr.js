'use strict';

var Utils = require('./utils');
var BaseApi = require('./base-api');

/**
 * Tumblr API-loading class.
 * @class Tumblr
 */
var Tumblr = function () {
    this.initialize();
};
Tumblr.prototype = Utils.extend({}, BaseApi.prototype, {

    /**
     * Loads the script to the API.
     * @param {Object} options - load options
     * @param {Object} options.apiConfig - The Tumblr api options
     * @param {Object} options.apiConfig.base-hostname - The base-hostname
     * @param {Object} options.apiConfig.api_key - API key
     * @param {Function} [callback] - Fires when the FB SDK has been loaded
     */
    load: function (options, callback) {
        this.onReadyCallback = 'onTumblrReady';

        this.options = options = Utils.extend({
            apiConfig: {}
        }, options);

        if (!options.apiConfig['base-hostname']) {
            return console.error('Tumblr load() method needs to be passed a "base-hostname"');
        }

        options.apiConfig.api_key = options.apiConfig.api_key || '';

        options.scriptUrl = '//api.tumblr.com/v2/blog/' + options.apiConfig['base-hostname'] + '/?' +
        'api_key=' + options.apiConfig.api_key + '&' +
        'callback=' + this.onReadyCallback;

        window[this.onReadyCallback] = this._triggerScriptLoaded.bind(this);

        this.injectScript(options.scriptUrl, 'tumblr-lscript', callback);
    },

    /**
     * Makes an API call for latest posts and returns them in a standard block of html.
     * @param url
     * @param options
     * @param callback
     */
    getPostsEmbed: function (url, options, callback) {

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
        request.onload = function() {
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

});

module.exports = window.SocialApi.Tumblr = new Tumblr();

