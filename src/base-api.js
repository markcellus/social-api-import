define( function () {
    'use strict';

    /**
     * An abstract class of which all API modules should extend.
     * @class BaseApi
     */
    var BaseApi = {

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
            var js,
                fjs = el.getElementsByTagName('script')[0];
            if (!el.querySelector('#' + id)) {
                js = document.createElement('script');
                js.id = id;
                js.src = path;
                fjs.parentNode.insertBefore(js, fjs);
            }
            callback ? callback() : null;
        }

    };
    return BaseApi;

});
