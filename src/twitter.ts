import BaseApi from './base-api';
import {OAuth, OAuth2} from 'oauth';

/**
 * Twitter API-loading class.
 * @class Twitter
 */
class Twitter extends BaseApi {

    /**
     * Constructs instance.
     * @param [options]
     * @param {String} [options.apiKey] - Application's consumer key (from app dashboard)
     * @param {String} [options.apiSecret] - Application's consumer secret (from app dashboard)
     */
    constructor (options = {}) {
        super(options);
        this.options = options;
    }
    

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

    /**
     * Gets Twitter's application-level "bearer" token necessary to use the API, without a user context.
     * @private
     */
    _fetchAppToken () {
        const oauth2 = new OAuth2(
            this.options.apiKey,
            this.options.apiSecret,
            'https://api.twitter.com/',
            null,
            'oauth2/token',
            null);

        return new Promise((resolve, reject) => {
            oauth2.getOAuthAccessToken(
                '',
                {'grant_type':'client_credentials'},
                function (e, accessToken, refreshToken, results){
                    if (e) {
                        reject(e);
                    } else {
                        resolve(accessToken);
                    }
                });
        });
    }


    /**
     * Fetches the a user's access token using OAuth which is needed to utilize the social network's API methods.
     * @returns {Promise.<string>}
     * @private
     */
    _fetchUserAccessToken () {
        const oauth = new OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            this.options.apiKey,
            this.options.apiSecret,
            '1.0A',
            null,
            'HMAC-SHA1'
        );
        return new Promise((resolve, reject) => {
            oauth.getOAuthRequestToken((err, token, secret) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        token: token,
                        secret: secret
                    });
                }
            });
        })
    }

    /**
     * Logs a user into twitter.
     * @param options
     * @returns {Promise.<{Object}>} Returns a promise when user has logged in successfully and have approved all the permissions
     * @returns {Promise.<{Object}>.String} accessToken
     * @returns {Promise.<{Object}>.Number} userId
     * @returns {Promise.<{Object}>.Date} expiresAt
     */
    login (options = {}) {
        return this.load().then(() => {
            return this._fetchUserAccessToken().then((result) => {
                return {
                    accessToken: result.token,
                    accessTokenSecret: result.secret
                }
            });
        });
    }

    static get id () {
        return 'twitter';
    }
}

export default Twitter;
