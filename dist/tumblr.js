(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

        this._apiLoadListeners = this._apiLoadListeners || [];
        this._scriptLoadListeners = this._scriptLoadListeners || [];

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
        if (this.scriptEl.parentNode) {
            this.scriptEl.parentNode.removeChild(this.scriptEl);
        }
        var index = BaseApi.prototype._loadedScripts.indexOf(this._sid);
        if (index > -1) {
            BaseApi.prototype._loadedScripts.splice(index, 1);
        }
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
            if (listener) {
                this._scriptLoadListeners.push(listener);
            }
            this.scriptEl = this.createScriptElement();
            this.scriptEl.id = id;
            this.scriptEl.src = path;
            this.scriptEl.onload = this.scriptEl.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'complete') {
                    BaseApi.prototype._loadedScripts.push(this._sid);
                    this._scriptLoadListeners.forEach(function (func) {
                        func();
                    });
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
        this._apiLoadListeners.forEach(function (func) {
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
        if (listener && this._apiLoadListeners.indexOf(listener) === -1) {
            this._apiLoadListeners.push(listener);
        }
    }
};

module.exports = BaseApi;


},{}],2:[function(require,module,exports){
'use strict';

var Utils = require('./utils');
var BaseApi = require('./base-api');

/**
 * Tumblr API-loading class.
 * @class Tumblr
 */
var Tumblr = function () {
    this.initialize();
};
Tumblr.prototype = Utils.extend({}, BaseApi.prototype, {

    /**
     * Loads the script to the API.
     * @param {Object} options - load options
     * @param {Object} options.apiConfig - The Tumblr api options
     * @param {Object} options.apiConfig.base-hostname - The base-hostname
     * @param {Object} options.apiConfig.api_key - API key
     * @param {Function} [callback] - Fires when the FB SDK has been loaded
     */
    load: function (options, callback) {
        this.onReadyCallback = 'onTumblrReady';

        this.options = options = Utils.extend({
            apiConfig: {}
        }, options);

        if (!options.apiConfig['base-hostname']) {
            return console.error('Tumblr load() method needs to be passed a "base-hostname"');
        }

        options.apiConfig.api_key = options.apiConfig.api_key || '';

        options.scriptUrl = '//api.tumblr.com/v2/blog/' + options.apiConfig['base-hostname'] + '/?' +
        'api_key=' + options.apiConfig.api_key + '&' +
        'callback=' + this.onReadyCallback;

        this.loadScript(options.scriptUrl, 'tumblr-lscript');
        this.loadApi(callback);
    },

    /**
     * Fires callback when API has been loaded.
     * @param {Function} cb - The callback
     * @private
     */
    _handleLoadApi: function (cb) {
        window[this.onReadyCallback] = cb;
    },

    /**
     * Makes an API call for latest posts and returns them in a standard block of html.
     * @param url
     * @param options
     * @param callback
     */
    getPostsEmbed: function (url, options, callback) {

        var request = new XMLHttpRequest(),
            err,
            onComplete = function (err) {
                callback ? callback(err) : null;
            };

        if (typeof options === 'function') {
            options = callback;
        }

        // add api key to call
        url += '?api_key=' + this.options.apiConfig.api_key + '&jsonp=';

        request.open('GET', url, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var data = JSON.parse(request.responseText);
            } else {
                // error
                err = request
            }
            onComplete(err);
        };
        request.onerror = function () {
            console.log('error occurred');
            console.log(arguments);
        };
        request.send();
    }

});

module.exports = window.SocialApi.Tumblr = new Tumblr();

},{"./base-api":1,"./utils":3}],3:[function(require,module,exports){
'use strict';
/**
 * A class that provides helpful utilities.
 * @class Utils
 */
var Utils = {
    /**
     * Creates an HTML Element from an html string.
     * @param {string} html - String of html
     * @returns {HTMLElement} - Returns and html element node
     */
    createHtmlElement: function (html) {
        var tempParentEl,
            el;
        if (html) {
            html = html.trim(html);
            tempParentEl = document.createElement('div');
            tempParentEl.innerHTML = html;
            el = tempParentEl.childNodes[0];
            return tempParentEl.removeChild(el);
        }
    },

    /**
     * Merges the contents of two or more objects.
     * @param {object} obj - The target object
     * @param {...object} - Additional objects who's properties will be merged in
     */
    extend: function (target) {
        var merged = target,
            source, i;
        for (i = 1; i < arguments.length; i++) {
            source = arguments[i];
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    merged[prop] = source[prop];
                }
            }
        }
        return merged;
    }
};

module.exports = Utils;



},{}]},{},[2])