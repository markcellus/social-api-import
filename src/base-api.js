define(function(require, exports, module) {

    'use strict';

    /**
     * An abstract class of which all API modules should extend.
     * @class BaseApi
     */
    window.SocialApi = window.SocialApi || {};

    var BaseApi = function () {};

    BaseApi.prototype = {

        /**
         * Loads the script to the API.
         * @param {Object} options - load options
         * @param {Object} options.scriptUrl - The src url of the script js file
         * @param {Object} options.apiConfig - The FB.init() options
         * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
         * @abstract
         */
        load: function (options, callback) {
            callback ? callback() : null;
        },

        /**
         * Loads the javascript file for the API.
         * @param {HTMLElement} el - The element of which to attach the script element
         * @param {string} path - The value that is added as the src path to the script
         * @param {string} id - The unique id attribute that will be added to the script tag
         * @param {Function} [callback] - The callback fired when the script finishes loading.
         * @abstract
         */
        loadScript: function (el, path, id, callback) {
            var scriptEl,
                parentEl = el.getElementsByTagName('script')[0],
                loaded = false;
            if (!el.querySelector('#' + id)) {
                scriptEl = document.createElement('script');
                scriptEl.id = id;
                scriptEl.src = path;
                scriptEl.onload = scriptEl.onreadystatechange = function () {
                    if (!loaded && (!this.readyState || this.readyState === 'complete')) {
                        loaded = true;
                        callback ? callback() : null;
                    }
                };
                parentEl.parentNode.insertBefore(scriptEl, parentEl);
            }
        }
    };

    module.exports = BaseApi;

});
