import BaseApi from './base-api';

const PERMISSIONS_MAP = {
    createPosts: ['publish_actions'],
    readPosts: ['user_posts'],
    updatePosts: ['publish_actions'],
    deletePosts: ['publish_actions'],
    readProfile: ['public_profile', 'user_about_me', 'user_birthday', 'user_location', 'user_work_history'],
    readFriendProfiles: ['user_friends']
};

/**
 * Facebook API class.
 * @class Facebook
 */
class Facebook extends BaseApi {

    /**
     * Initializes the the API.
     * @param {Object} [options] - Facebook API options
     * @param {Number} [options.apiVersion] - The version of API to use
     * @param {Boolean} [options.xfbml] - Whether to use Facebook's extended markup language
     */
    constructor (options = {}) {
        if (options.version) {
            options.version = options.version.split('v')[1];
        }

        options.apiVersion = options.apiVersion || options.version || 3.0;
        options.xfbml = options.xfbml || true;
        super(options);
        this.options = options;
    }

    /**
     * Logs a user into facebook in order to get the access token for that user.
     * @param options
     * @param {Array} options.permissions - An array of standardized permissions (see Permissions docs)
     * @returns {Promise.<{Object}>} Returns a promise when user has logged in successfully and have approved all the permissions
     * @returns {Promise.<{Object}>.String} accessToken
     * @returns {Promise.<{Object}>.Number} userId
     * @returns {Promise.<{Object}>.Date} expiresAt
     */
    login (options = {}) {

        return this.load().then(() => {

            const buildScope = () => {
                options.permissions = options.permissions || [];
                return options.permissions.reduce((prev, perm) => {
                    const values = PERMISSIONS_MAP[perm] || [];
                    return values.reduce((p, value) => {
                        const delimiter = prev ? ',' : '';
                        let str = value || '';
                        if (prev.indexOf(value) === -1) {
                            str = `${delimiter}${value}`;
                        } else {
                            return prev;
                        }
                        return prev += str;
                    }, prev);
                }, '');
            };

            options.scope = options.scope || buildScope(options.permissions);

            return new Promise((resolve) => {
                this.FB.login((response) => {
                    if (response.authResponse) {
                        // authorized!
                        resolve({
                            accessToken: response.authResponse.accessToken,
                            userId: response.authResponse.userID,
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
    _handleLoadApi () {
        return new Promise((resolve) => {
            window.fbAsyncInit = () => {
                this.options.version = 'v' + this.options.apiVersion;
                FB.init(this.options);
                this.FB = FB;
                resolve(FB);
            };
            this._loadScript('https://connect.facebook.net/en_US/sdk.js');
        });
    }

    static get id () {
        return 'facebook';
    }

    destroy () {
        delete window.fbAsyncInit;
        return super.destroy();
    }

}

export default Facebook;
