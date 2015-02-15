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
    loadScript: function (path, id, listener) {
        if (!this.isScriptLoaded()) {
            // call loadApi() before script injection in case there are
            // any event listeners in an implementation of the _handleLoadApi() method
            this.loadApi();
            this.scriptEl = this.createScriptElement();
            this.scriptEl.id = id;
            this.scriptEl.src = path;
            this.scriptEl.onload = this.scriptEl.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'complete') {
                    BaseApi.prototype._loadedScripts.push(this._sid);
                    listener ? listener() : null;
                }
            }.bind(this);
            document.getElementsByTagName('body')[0].appendChild(this.scriptEl);
        } else {
            listener ? listener() : null;
        }
    },

    /**
     * Loads the API.
     */
    loadApi: function (listener) {
        listener = listener || function () {};
        if (this.isScriptLoaded()) {
            listener.apply(this, this.loadedArgs);
        } else {
            this.queueLoadListener(listener);
            this._handleLoadApi(this._triggerApiLoaded.bind(this));
        }
    },

    /**
     * A function that should be overridden that handles when the API is done loading.
     * @param listener
     * @private
     * @abstract
     */
    _handleLoadApi: function (listener) {
        listener ? listener() : null;
    },

    /**
     * Function that should be fired when the API is loaded,
     * causing all load listeners to be invoked.
     * @param {*} arguments - Any arguments to pass to listeners
     * @private
     * @abstract
     */
    _triggerApiLoaded: function () {
        this.loadedArgs = arguments;
        this._loadListeners.forEach(function (func) {
            func.apply(this, this.loadedArgs);
        }.bind(this));
        this._apiLoaded = true;
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
     * Whether the API has been loaded.
     * @returns {boolean|*}
     */
    isApiLoaded: function () {
        return this._apiLoaded;
    },

    /**
     * Whether the script has been loaded.
     * @returns {boolean}
     */
    isScriptLoaded: function () {
        return BaseApi.prototype._loadedScripts.indexOf(this._sid) !== -1;
    },

    /**
     * Adds a listener function be notified once the script has finished loading.
     * @param {Function} listener - The listener function
     */
    queueLoadListener: function (listener) {
        this._loadListeners = this._loadListeners || [];
        if (listener && this._loadListeners.indexOf(listener) === -1) {
            this._loadListeners.push(listener);
        }
    }
};

module.exports = BaseApi;

