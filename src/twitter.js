define(['./utils'], function (Utils) {
    'use strict';

    /**
     * Twitter API-loading class.
     * @class Twitter
     */
    var Twitter = {

        /**
         * Loads the script to the API and returns the FB object.
         * @param {Object} options - load options
         * @param {Object} options.scriptUrl - The src url of the script js file
         * @param {Object} options.apiConfig - The FB.init() options
         * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
         */
        load: function (options, callback) {

            options = Utils.extend({
                scriptUrl: 'https://platform.twitter.com/widgets.js',
                apiConfig: {}
            }, options);

            window.twttr = (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0],
                    t = window.twttr || {};
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = options.scriptUrl;
                fjs.parentNode.insertBefore(js, fjs);
                t._e = [];
                t.ready = function(f) {
                    t._e.push(f);
                };
                callback ? callback(t) : null;
                return t;
            }(document, 'script', 'twitter-wjs'));
        }

    };
    return Twitter;

});
