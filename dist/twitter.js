(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * An abstract class of which all API modules should extend.
 * @class BaseApi
 */
window.SocialApi = window.SocialApi || {};

var BaseApi = {

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
     * Loads the javascript file for the API.
     * @param {HTMLElement} el - The element of which to attach the script element
     * @param {string} path - The value that is added as the src path to the script
     * @param {string} id - The unique id attribute that will be added to the script tag
     * @param {Function} [callback] - The callback fired when the script finishes loading.
     * @abstract
     */
    loadScript: function (el, path, id, callback) {
        var scriptEl,
            parentEl = el.getElementsByTagName('script')[0],
            loaded = false;
        if (!el.querySelector('#' + id)) {
            scriptEl = document.createElement('script');
            scriptEl.id = id;
            scriptEl.src = path;
            scriptEl.onload = scriptEl.onreadystatechange = function () {
                if (!loaded && (!this.readyState || this.readyState === 'complete')) {
                    loaded = true;
                    callback ? callback() : null;
                }
            };
            parentEl.parentNode.insertBefore(scriptEl, parentEl);
        }
    }
};

module.exports = BaseApi;

},{}],2:[function(require,module,exports){
'use strict';

var Utils = require('./utils');
var BaseApi = require('./base-api');

/**
 * Twitter API-loading class.
 * @class Twitter
 */
var Twitter = Utils.extend({}, BaseApi, {

    /**
     * Loads the script to the API and returns the FB object.
     * @param {Object} options - load options
     * @param {Object} options.scriptUrl - The src url of the script js file
     * @param {Object} options.apiConfig - The FB.init() options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     */
    load: function (options, callback) {

        options = Utils.extend({
            scriptUrl: 'https://platform.twitter.com/widgets.js',
            apiConfig: {}
        }, options);
        var t = window.twttr || {};
        t.ready = function(f) {
            t._e.push(f);
        };
        window.twttr = t;
        this.loadScript(document, options.scriptUrl, 'twitter-wjs', function () {
            callback ? callback(t) : null;
        });
    }

});

module.exports = window.SocialApi.Twitter = Twitter;

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

},{}]},{},[2]);
