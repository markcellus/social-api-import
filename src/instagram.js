define(['./utils'], function (Utils) {
    'use strict';

    /**
     * Instagram API-loading class.
     * @class Instagram
     */
    var Instagram = {

        /**
         * Loads the script to the API and returns the FB object.
         * @param {Object} options - load options
         * @param {Object} options.scriptUrl - The src url of the script js file
         * @param {Object} options.apiConfig - The FB.init() options
         * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
         */
        load: function (options, callback) {
            var js,
                fjs = document.getElementsByTagName('script')[0],
                id = 'instagram-sdk';

            options = Utils.extend({
                scriptUrl: '//platform.instagram.com/en_US/embeds.js',
                apiConfig: {}
            }, options);

            if (!document.getElementById(id)) {
                js = document.createElement('script');
                js.id = id;
                js.src = options.scriptUrl;
                fjs.parentNode.insertBefore(js, fjs);
            }
            callback ? callback() : null;
        }

    };
    return Instagram;

});
