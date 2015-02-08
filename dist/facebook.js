/** 
* social-api - v0.0.2.
* https://github.com/mkay581/social-api.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
define(['./utils', './base-api'], function (Utils, BaseApi) {
    'use strict';

    /**
     * Facebook API class.
     * @class Facebook
     */
    var Facebook = Utils.extend({}, BaseApi, {

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

            window.fbAsyncInit = function() {
                FB.init(options.apiConfig);
                callback ? callback(FB) : null;
            };
            this.loadScript(document, options.scriptUrl, 'facebook-jssdk');
        }

    });
    return Facebook;

});
