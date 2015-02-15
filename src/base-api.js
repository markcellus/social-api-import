'use strict';

/**
 * An abstract class of which all API modules should extend.
 * @class BaseApi
 */
window.SocialApi = window.SocialApi || {};

var BaseApi = function () {
    this.initialize();
};

BaseApi.prototype = {

    /**
     * When the API is instantiated.
     */
    initialize: function () {
        BaseApi.prototype._scriptCount = BaseApi.prototype._scriptCount || 0;
        BaseApi.prototype._scriptCount++;

        // keep track of loaded scripts
        BaseApi.prototype._loadedScripts = BaseApi.prototype._loadedScripts || [];
        // set unique instance id
        this._sid = BaseApi.prototype._scriptCount;

    },

    /**
     * Loads the script to the API.
     * @param {Object} options - load options
     * @param {Object} options.scriptUrl - The src url of the script js file
     * @param {Object} options.apiConfig - The FB.init() options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     * @abstract
     */
    load: function (options, callback) {
        callback ? callback() : null;
    },

    /**
     * Removes the script from the DOM.
     * @abstract
     */
    unload: function () {
        this.scriptEl.parentNode.removeChild(this.scriptEl);
    },

    /**
     * Injects the Script into the DOM.
     * @param {string} path - The value that is added as the src path to the script
     * @param {string} id - The unique id attribute that will be added to the script tag
     * @param {Function} [listener] - The callback fired when the script finishes loading.
     * @abstract
     */
    injectScript: function (path, id, listener) {
        var sid = this._sid,
            loaded = BaseApi.prototype._loadedScripts.indexOf(sid) !== -1;

        if (!loaded) {
            this.scriptEl = this.createScriptElement();
            this.scriptEl.id = id;
            this.scriptEl.src = path;
            this.scriptEl.onload = this.scriptEl.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'complete') {
                    BaseApi.prototype._loadedScripts.push(sid);
                }
            }.bind(this);
            document.getElementsByTagName('body')[0].appendChild(this.scriptEl);
            this.queueLoadListener(listener);
        } else {
            listener ? listener() : null;
        }
    },

    /**
     * Function that should be fired when the script is loaded.
     * @param {*} arguments - Any arguments to pass to listeners
     * @private
     * @abstract
     */
    _triggerScriptLoaded: function () {
        var args = arguments;
        this._loadListeners.forEach(function (func) {
            func.apply(this, args);
        });
    },

    /**
     * Creates a new script element.
     * Primarily here for unit tests.
     * @returns {HTMLElement}
     */
    createScriptElement: function () {
        return document.createElement('script');
    },

    /**
     * Adds a listener function be notified once the script has finished loading.
     * @param {Function} listener - The listener function
     */
    queueLoadListener: function (listener) {
        this._loadListeners = this._loadListeners || [];
        if (listener) {
            this._loadListeners.push(listener);
        }
    }
};

module.exports = BaseApi;

