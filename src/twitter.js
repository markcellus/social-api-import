'use strict';
import BaseApi from './base-api';
import {Promise} from 'es6-promise';

/**
 * Twitter API-loading class.
 * @class Twitter
 */
class Twitter extends BaseApi {

    /**
     * Loads the Twitter API.
     * @private
     * @returns {Promise}
     */
    _handleLoadApi () {
        window.twttr = window.twttr || {};
        window.twttr._e = [];
        window.twttr.ready = function (f) {
            window.twttr._e.push(f);
        };
        return new Promise((resolve) => {
            window.twttr.ready(function (twttr) {
                resolve(twttr);
            });
            this._loadScript('https://platform.twitter.com/widgets.js');
        });
    }
}

export default new Twitter();
