'use strict';
import BaseApi from './base-api';
import {Promise} from 'es6-promise';

const PERMISSIONS_MAP = {
    createPosts: 'publish_actions',
    readPosts: 'user_posts',
    updatePosts: 'publish_actions',
    deletePosts: 'publish_actions',
    readProfile: 'public_profile',
    readFriendProfiles: 'user_friends'
};

/**
 * Facebook API class.
 * @class Facebook
 */
class Facebook extends BaseApi {

    /**
     * Loads the script to the API and returns the FB object.
     * @param {Object} [options] - Facebook API options
     * @returns {Promise} Returns a promise that resolves with the FB object when the FB SDK has been loaded
     */
    load (options = {}) {
        options.version = options.version || 'v2.1';
        options.xfbml = options.xfbml || true;
        return super.load(options);
    }

    /**
     * Logs a user into facebook.
     * @param options
     * @param {Array} options.permissions - An array of standardized permissions (see Permissions docs)
     * @returns {Promise.<{Object}>} Returns a promise when user has logged in successfully and have approved all the permissions
     * @returns {Promise.<{Object}>.String} accessToken
     * @returns {Promise.<{Object}>.Number} userId
     * @returns {Promise.<{Object}>.Date} expiresAt
     */
    login (options = {}) {

        return this.load().then(() => {

            let buildScope = () => {
                options.permissions = options.permissions || [];
                return options.permissions.reduce((prev, perm) => {
                    let value = PERMISSIONS_MAP[perm] || '';
                    if (value && prev.indexOf(value) === -1) {
                        value = prev ? ',' + value : value;
                    } else {
                        value = ''
                    }
                    return prev += value;
                }, '');
            };

            options.scope = options.scope || buildScope(options.permissions);

            return new Promise((resolve) => {
                this.FB.login((response) => {
                    if (response.authResponse) {
                        // authorized!
                        resolve({
                            accessToken: response.authResponse.accessToken,
                            userId: response.authResponse.userId,
                            expiresAt: response.authResponse.expiresIn
                        });
                    } else {
                        // User either abandoned the login flow or,
                        // for some other reason, did not fully authorize
                        resolve({});
                    }
                }, options);
            });
        })
    }

    /**
     * Handles loading the API.
     * @private
     * @returns {Promise}
     */
    _handleLoadApi (options) {
        return new Promise((resolve) => {
            window.fbAsyncInit = () => {
                FB.init(options);
                this.FB = FB;
                resolve(FB);
            };
            this._loadScript('//connect.facebook.net/en_US/sdk.js');
        });
    }

}

export default new Facebook();
