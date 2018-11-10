import { script } from 'dynamic-import';

/**
 * An abstract class of which all API classes should extend.
 * @class BaseApi
 */
class BaseApi {
    
    /**
     * Constructor that sets stuff up for API methods.
     * @param {Object} [options] - Internal API options
     * @param {String} [options.appId] - The application ID supplied by the network
     * @param {String} [options.apiVersion] - The version of the API to use
     * @param {String} [options.apiKey] - Application key
     * @param {String} [options.apiSecret] - Application secret
     * @param {String} [options.callbackUrl] - The url to redirect to when done loading
     * @returns {Promise} - Returns the network's API object after it has been loaded
     * @abstract
     */
    constructor (options = {}) {
        this.options = options;
        BaseApi.prototype._loadedScripts = BaseApi.prototype._loadedScripts || [];
    }

    /**
     * Loads the script to the API.
     * @returns {Promise} - Returns the network's API object after it has been loaded
     * @abstract
     */
    load () {
        if (!this._loadApiListenerPromiseMap) {
            this._loadApiListenerPromiseMap = this._handleLoadApi(this.options);
        }
        return this._loadApiListenerPromiseMap;
    }

    /**
     * Removes the script from the DOM.
     * @abstract
     * @returns {Promise}
     */
    destroy () {
        let idx = BaseApi.prototype._loadedScripts.indexOf(this._script);
        BaseApi.prototype._loadedScripts.splice(idx, 1);
        if (this._script && BaseApi.prototype._loadedScripts.indexOf(this._script) <= -1) {
            script.import(this._script);
        }
    }

    /**
     * Gets the access token for a user by logging them in to the social network.
     * @param {Object} [options] - The social networks options to pass for their login api call.
     * @param {Array} [options.permissions] - An array of standardized permissions (see Permissions docs)
     * @returns {Promise.<{Object}>} Returns a promise when user has logged in successfully and have approved all the permissions
     * @returns {Promise.<{Object}>.String} accessToken
     * @returns {Promise.<{Object}>.Number} userId
     * @returns {Promise.<{Object}>.Date} expiresAt
     * @returns {Promise} Returns a promise when the user has successfully logged in.
     */
    login (options = {}) {
       return Promise.resolve({
           accessToken: '',
           accessTokenSecret: '',
           userId: '',
           expiresAt: null
       });
    }

    /**
     * Injects the Script into the DOM.
     * @param {string} path - The value that is added as the src path to the script
     * @returns {Promise} Returns a promise that is resolved when the script finishes loading.
     * @private
     * @abstract
     */
    _loadScript (path) {
        this._script = path;
        BaseApi.prototype._loadedScripts.push(this._script);
        return script.import(this._script);
    }
    
    /**
     * A function that should be overridden that handles when the API is done loading.
     * @param {Object} [options] - API options passed in instantiation
     * @private
     * @abstract
     * @returns {Promise}
     */
    _handleLoadApi (options) {
        return Promise.resolve();
    }

    static get id () {
        return 'base-api';
    }
    
}

export default BaseApi;

