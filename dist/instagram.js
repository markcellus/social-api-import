/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function ensurePathArray(paths) {
    if (!paths) {
        paths = [];
    }
    else if (typeof paths === 'string') {
        paths = [paths];
    }
    return paths;
}
const head = document.getElementsByTagName('head')[0];
const scriptMaps = {};
const script = {
    import(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            let map;
            const loadPromises = [];
            paths = ensurePathArray(paths);
            paths.forEach((path) => {
                map = scriptMaps[path] = scriptMaps[path] || {};
                if (!map.promise) {
                    map.path = path;
                    map.promise = new Promise((resolve) => {
                        const scriptElement = document.createElement('script');
                        scriptElement.setAttribute('type', 'text/javascript');
                        scriptElement.src = path;
                        scriptElement.addEventListener('load', resolve);
                        head.appendChild(scriptElement);
                    });
                }
                loadPromises.push(map.promise);
            });
            return Promise.all(loadPromises);
        });
    },
    unload(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            let file;
            return new Promise((resolve) => {
                paths = ensurePathArray(paths);
                paths.forEach((path) => {
                    file = head.querySelectorAll('script[src="' + path + '"]')[0];
                    if (file) {
                        head.removeChild(file);
                        delete scriptMaps[path];
                    }
                });
                resolve();
            });
        });
    }
};

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
    constructor(options = {}) {
        this.options = options;
        BaseApi.prototype._loadedScripts = BaseApi.prototype._loadedScripts || [];
    }
    /**
     * Loads the script to the API.
     * @returns {Promise} - Returns the network's API object after it has been loaded
     * @abstract
     */
    load() {
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
    destroy() {
        const idx = BaseApi.prototype._loadedScripts.indexOf(this._script);
        BaseApi.prototype._loadedScripts.splice(idx, 1);
        if (this._script && BaseApi.prototype._loadedScripts.indexOf(this._script) <= -1) {
            script.unload(this._script);
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
    login(options = {}) {
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
    _loadScript(path) {
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
    _handleLoadApi(options) {
        return Promise.resolve();
    }
    static get id() {
        return 'base-api';
    }
}

/**
 * Instagram API-loading class.
 * @class Instagram
 */
class Instagram extends BaseApi {
    static get id() {
        return 'instagram';
    }
    /**
     * Handles loading the API.
     * @private
     */
    _handleLoadApi() {
        return this._loadScript('//platform.instagram.com/en_US/embeds.js').then(() => {
            // must manually process instagram embed
            window.instgrm.Embeds.process();
            return window.instgrm;
        });
    }
}

export default Instagram;
