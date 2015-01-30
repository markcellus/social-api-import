define(['./utils'], function (Utils) {
    'use strict';

    /**
     * Facebook API class.
     * @class Facebook
     */
    var Facebook = {

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
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = options.scriptUrl;
                fjs.parentNode.insertBefore(js, fjs);
            }.bind(this)(document, 'script', 'facebook-jssdk'));
        }

    };
    return Facebook;

});
