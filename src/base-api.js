'use strict';

/**
 * An abstract class of which all API modules should extend.
 * @class BaseApi
 */
class BaseApi {

    /**
     * When the API is instantiated.
     */
    constructor () {
        BaseApi.prototype._scriptCount = BaseApi.prototype._scriptCount || 0;
        BaseApi.prototype._scriptCount++;
        // set unique instance id
        this._sid = BaseApi.prototype._scriptCount;
        this._apiLoadListeners = this._apiLoadListeners || [];

    }

    /**
     * Loads the script to the API.
     * @param {Object} options - load options
     * @param {Object} options.scriptUrl - The src url of the script js file
     * @param {Object} options.apiConfig - The FB.init() options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     * @abstract
     */
    load (options, callback) {
        callback ? callback() : null;
    }

    /**
     * Removes the script from the DOM.
     * @abstract
     */
    unload () {
        if (this.scriptEl.parentNode) {
            this.scriptEl.parentNode.removeChild(this.scriptEl);
        }
        this._scriptLoaded = false;
    }

    /**
     * Injects the Script into the DOM.
     * @param {string} path - The value that is added as the src path to the script
     * @param {string} id - The unique id attribute that will be added to the script tag
     * @param {Function} [listener] - The callback fired when the script finishes loading.
     * @abstract
     */
    loadScript (path, id, listener) {
        this.scriptEl = this.createScriptElement();
        this.scriptEl.id = id;
        this.scriptEl.src = path;
        this.scriptEl.onload = this.scriptEl.onreadystatechange = function () {
            if (!this.readyState || this.readyState === 'complete') {
                this._scriptLoaded = true;
                listener ? listener() : null;
            }
        }.bind(this);
        document.getElementsByTagName('head')[0].appendChild(this.scriptEl);
    }
    
    /**
     * Loads the API.
     */
    loadApi (listener) {
        listener = listener || function () {};
        if (this.getLoadStatus() === 'loaded') {
            listener.apply(this, this.loadedArgs);
        } else {
            this.queueLoadListener(listener);
        }
        if (this.getLoadStatus() === 'notLoaded') {
            this._handleLoadApi(this._triggerApiLoaded.bind(this));
        }
    }

    /**
     * A function that should be overridden that handles when the API is done loading.
     * @param listener
     * @private
     * @abstract
     */
    _handleLoadApi (listener) {
        listener ? listener() : null;
    }

    /**
     * Function that should be fired when the API is loaded,
     * causing all load listeners to be invoked.
     * @param {*} arguments - Any arguments to pass to listeners
     * @private
     * @abstract
     */
    _triggerApiLoaded () {
        this.loadedArgs = arguments;
        this._apiLoadListeners.forEach(function (func) {
            func.apply(this, this.loadedArgs);
        }.bind(this));
        this._apiLoadListeners = [];
        this._apiLoaded = true;
    }

    /**
     * Creates a new script element.
     * Primarily here for unit tests.
     * @returns {HTMLElement}
     */
    createScriptElement () {
        return document.createElement('script');
    }

    /**
     * Gets the load status.
     * @returns {string}
     */
    getLoadStatus () {
        if (!this._scriptLoaded) {
            return 'notLoaded';
        } else if (this._apiLoaded) {
            return 'loaded';
        } else {
            return 'loading';
        }
    }

    /**
     * Adds a listener function be notified once the script has finished loading.
     * @param {Function} listener - The listener function
     */
    queueLoadListener (listener) {
        if (listener && this._apiLoadListeners.indexOf(listener) === -1) {
            this._apiLoadListeners.push(listener);
        }
    }
}

export default BaseApi;

