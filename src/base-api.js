'use strict';
import ResourceManager from 'resource-manager-js';
import {Promise} from 'es6-promise';

/**
 * An abstract class of which all API classes should extend.
 * @class BaseApi
 */
class BaseApi {

    /**
     * Loads the script to the API.
     * @param {Object} [options] - API options
     * @returns {Promise} - Returns the network's API object after it has been loaded
     * @abstract
     */
    load (options = {}) {
        if (!this._loadApiListenerPromise) {
            this._loadApiListenerPromise = this._handleLoadApi(options);
        }
        return this._loadApiListenerPromise;
    }

    /**
     * Removes the script from the DOM.
     * @abstract
     * @returns {Promise}
     */
    unload () {
        this._loadApiListenerPromise = null;
        return ResourceManager.unloadScript(this._script);
    }

    /**
     * Logs the user in to the social network.
     * @param {Object} options - The social networks options to pass for their login api call.
     * @returns {Promise} Returns a promise when the user has successfully logged in.
     */
    login (options = {}) {
       return Promise.resolve();
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
        return ResourceManager.loadScript(this._script);
    }
    
    /**
     * A function that should be overridden that handles when the API is done loading.
     * @param {Object} [options] - API options
     * @private
     * @abstract
     * @returns {Promise}
     */
    _handleLoadApi (options) {
        return Promise.resolve();
    }
    
}

export default BaseApi;

