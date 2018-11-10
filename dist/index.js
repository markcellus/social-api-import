import crypto from 'crypto';
import http from 'http';
import https from 'https';
import url from 'url';
import querystring from 'querystring';

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
    constructor(options = {}) {
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
    login(options = {}) {
        return this.load().then(() => {
            let buildScope = () => {
                options.permissions = options.permissions || [];
                return options.permissions.reduce((prev, perm) => {
                    let values = PERMISSIONS_MAP[perm] || [];
                    return values.reduce((p, value) => {
                        if (value && prev.indexOf(value) === -1) {
                            value = prev ? ',' + value : value;
                        }
                        else {
                            value = '';
                        }
                        return prev += value;
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
                    }
                    else {
                        // User either abandoned the login flow or,
                        // for some other reason, did not fully authorize
                        resolve({});
                    }
                }, options);
            });
        });
    }
    /**
     * Handles loading the API.
     * @private
     * @returns {Promise}
     */
    _handleLoadApi() {
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
    static get id() {
        return 'facebook';
    }
    destroy() {
        delete window.fbAsyncInit;
        return super.destroy();
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

/**
 * Tumblr API-loading class.
 * @class Tumblr
 */
class Tumblr extends BaseApi {
    /**
     * Constructor
     * @param {Object} options - Tumblr API options
     * @param {Object} options.base-hostname - The base-hostname
     * @param {Object} [options.api_key] - API key
     * @returns {Promise} Returns a promise that resolves when the Tumblr API has been loaded
     */
    constructor(options = {}) {
        if (!options['base-hostname']) {
            throw Error('Tumblr constructor needs to be passed a "base-hostname" option');
        }
        options.api_key = options.api_key || '';
        super(options);
        this.options = options;
    }
    static get id() {
        return 'tumblr';
    }
    /**
     * Fires callback when API has been loaded.
     * @private
     */
    _handleLoadApi() {
        let callbackMethod = 'onTumblrReady';
        // we're arbitrarily choosing the "/posts" endpoint to prevent getting a 404 error
        let scriptUrl = '//api.tumblr.com/v2/blog/' + this.options['base-hostname'] + '/posts?' +
            'api_key=' + this.options.api_key + '&' +
            'callback=' + callbackMethod;
        return new Promise((resolve) => {
            window[callbackMethod] = function () {
                resolve();
            };
            this._loadScript(scriptUrl);
        });
    }
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
var b64pad  = "="; /* base-64 pad character. "=" for strict RFC compliance   */
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

var HMACSHA1= function(key, data) {
  return b64_hmac_sha1(key, data);
};

var sha1 = {
	HMACSHA1: HMACSHA1
};

// Returns true if this is a host that closes *before* it ends?!?!
var isAnEarlyCloseHost= function( hostName ) {
  return hostName && hostName.match(".*google(apis)?.com$")
};

var _utils = {
	isAnEarlyCloseHost: isAnEarlyCloseHost
};

var oauth = createCommonjsModule(function (module, exports) {
exports.OAuth= function(requestUrl, accessUrl, consumerKey, consumerSecret, version, authorize_callback, signatureMethod, nonceSize, customHeaders) {
  this._isEcho = false;

  this._requestUrl= requestUrl;
  this._accessUrl= accessUrl;
  this._consumerKey= consumerKey;
  this._consumerSecret= this._encodeData( consumerSecret );
  if (signatureMethod == "RSA-SHA1") {
    this._privateKey = consumerSecret;
  }
  this._version= version;
  if( authorize_callback === undefined ) {
    this._authorize_callback= "oob";
  }
  else {
    this._authorize_callback= authorize_callback;
  }

  if( signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1")
    throw new Error("Un-supported signature method: " + signatureMethod )
  this._signatureMethod= signatureMethod;
  this._nonceSize= nonceSize || 32;
  this._headers= customHeaders || {"Accept" : "*/*",
                                   "Connection" : "close",
                                   "User-Agent" : "Node authentication"};
  this._clientOptions= this._defaultClientOptions= {"requestTokenHttpMethod": "POST",
                                                    "accessTokenHttpMethod": "POST",
                                                    "followRedirects": true};
  this._oauthParameterSeperator = ",";
};

exports.OAuthEcho= function(realm, verify_credentials, consumerKey, consumerSecret, version, signatureMethod, nonceSize, customHeaders) {
  this._isEcho = true;

  this._realm= realm;
  this._verifyCredentials = verify_credentials;
  this._consumerKey= consumerKey;
  this._consumerSecret= this._encodeData( consumerSecret );
  if (signatureMethod == "RSA-SHA1") {
    this._privateKey = consumerSecret;
  }
  this._version= version;

  if( signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1")
    throw new Error("Un-supported signature method: " + signatureMethod );
  this._signatureMethod= signatureMethod;
  this._nonceSize= nonceSize || 32;
  this._headers= customHeaders || {"Accept" : "*/*",
                                   "Connection" : "close",
                                   "User-Agent" : "Node authentication"};
  this._oauthParameterSeperator = ",";
};

exports.OAuthEcho.prototype = exports.OAuth.prototype;

exports.OAuth.prototype._getTimestamp= function() {
  return Math.floor( (new Date()).getTime() / 1000 );
};

exports.OAuth.prototype._encodeData= function(toEncode){
 if( toEncode == null || toEncode == "" ) return ""
 else {
    var result= encodeURIComponent(toEncode);
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    return result.replace(/\!/g, "%21")
                 .replace(/\'/g, "%27")
                 .replace(/\(/g, "%28")
                 .replace(/\)/g, "%29")
                 .replace(/\*/g, "%2A");
 }
};

exports.OAuth.prototype._decodeData= function(toDecode) {
  if( toDecode != null ) {
    toDecode = toDecode.replace(/\+/g, " ");
  }
  return decodeURIComponent( toDecode);
};

exports.OAuth.prototype._getSignature= function(method, url$$1, parameters, tokenSecret) {
  var signatureBase= this._createSignatureBase(method, url$$1, parameters);
  return this._createSignature( signatureBase, tokenSecret );
};

exports.OAuth.prototype._normalizeUrl= function(url$$1) {
  var parsedUrl= url.parse(url$$1, true);
   var port ="";
   if( parsedUrl.port ) {
     if( (parsedUrl.protocol == "http:" && parsedUrl.port != "80" ) ||
         (parsedUrl.protocol == "https:" && parsedUrl.port != "443") ) {
           port= ":" + parsedUrl.port;
         }
   }

  if( !parsedUrl.pathname  || parsedUrl.pathname == "" ) parsedUrl.pathname ="/";

  return parsedUrl.protocol + "//" + parsedUrl.hostname + port + parsedUrl.pathname;
};

// Is the parameter considered an OAuth parameter
exports.OAuth.prototype._isParameterNameAnOAuthParameter= function(parameter) {
  var m = parameter.match('^oauth_');
  if( m && ( m[0] === "oauth_" ) ) {
    return true;
  }
  else {
    return false;
  }
};

// build the OAuth request authorization header
exports.OAuth.prototype._buildAuthorizationHeaders= function(orderedParameters) {
  var authHeader="OAuth ";
  if( this._isEcho ) {
    authHeader += 'realm="' + this._realm + '",';
  }

  for( var i= 0 ; i < orderedParameters.length; i++) {
     // Whilst the all the parameters should be included within the signature, only the oauth_ arguments
     // should appear within the authorization header.
     if( this._isParameterNameAnOAuthParameter(orderedParameters[i][0]) ) {
      authHeader+= "" + this._encodeData(orderedParameters[i][0])+"=\""+ this._encodeData(orderedParameters[i][1])+"\""+ this._oauthParameterSeperator;
     }
  }

  authHeader= authHeader.substring(0, authHeader.length-this._oauthParameterSeperator.length);
  return authHeader;
};

// Takes an object literal that represents the arguments, and returns an array
// of argument/value pairs.
exports.OAuth.prototype._makeArrayOfArgumentsHash= function(argumentsHash) {
  var argument_pairs= [];
  for(var key in argumentsHash ) {
    if (argumentsHash.hasOwnProperty(key)) {
       var value= argumentsHash[key];
       if( Array.isArray(value) ) {
         for(var i=0;i<value.length;i++) {
           argument_pairs[argument_pairs.length]= [key, value[i]];
         }
       }
       else {
         argument_pairs[argument_pairs.length]= [key, value];
       }
    }
  }
  return argument_pairs;
};

// Sorts the encoded key value pairs by encoded name, then encoded value
exports.OAuth.prototype._sortRequestParams= function(argument_pairs) {
  // Sort by name, then value.
  argument_pairs.sort(function(a,b) {
      if ( a[0]== b[0] )  {
        return a[1] < b[1] ? -1 : 1;
      }
      else return a[0] < b[0] ? -1 : 1;
  });

  return argument_pairs;
};

exports.OAuth.prototype._normaliseRequestParams= function(args) {
  var argument_pairs= this._makeArrayOfArgumentsHash(args);
  // First encode them #3.4.1.3.2 .1
  for(var i=0;i<argument_pairs.length;i++) {
    argument_pairs[i][0]= this._encodeData( argument_pairs[i][0] );
    argument_pairs[i][1]= this._encodeData( argument_pairs[i][1] );
  }

  // Then sort them #3.4.1.3.2 .2
  argument_pairs= this._sortRequestParams( argument_pairs );

  // Then concatenate together #3.4.1.3.2 .3 & .4
  var args= "";
  for(var i=0;i<argument_pairs.length;i++) {
      args+= argument_pairs[i][0];
      args+= "=";
      args+= argument_pairs[i][1];
      if( i < argument_pairs.length-1 ) args+= "&";
  }
  return args;
};

exports.OAuth.prototype._createSignatureBase= function(method, url$$1, parameters) {
  url$$1= this._encodeData( this._normalizeUrl(url$$1) );
  parameters= this._encodeData( parameters );
  return method.toUpperCase() + "&" + url$$1 + "&" + parameters;
};

exports.OAuth.prototype._createSignature= function(signatureBase, tokenSecret) {
   if( tokenSecret === undefined ) var tokenSecret= "";
   else tokenSecret= this._encodeData( tokenSecret );
   // consumerSecret is already encoded
   var key= this._consumerSecret + "&" + tokenSecret;

   var hash= "";
   if( this._signatureMethod == "PLAINTEXT" ) {
     hash= key;
   }
   else if (this._signatureMethod == "RSA-SHA1") {
     key = this._privateKey || "";
     hash= crypto.createSign("RSA-SHA1").update(signatureBase).sign(key, 'base64');
   }
   else {
       if( crypto.Hmac ) {
         hash = crypto.createHmac("sha1", key).update(signatureBase).digest("base64");
       }
       else {
         hash= sha1.HMACSHA1(key, signatureBase);
       }
   }
   return hash;
};
exports.OAuth.prototype.NONCE_CHARS= ['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
              'o','p','q','r','s','t','u','v','w','x','y','z','A','B',
              'C','D','E','F','G','H','I','J','K','L','M','N','O','P',
              'Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3',
              '4','5','6','7','8','9'];

exports.OAuth.prototype._getNonce= function(nonceSize) {
   var result = [];
   var chars= this.NONCE_CHARS;
   var char_pos;
   var nonce_chars_length= chars.length;

   for (var i = 0; i < nonceSize; i++) {
       char_pos= Math.floor(Math.random() * nonce_chars_length);
       result[i]=  chars[char_pos];
   }
   return result.join('');
};

exports.OAuth.prototype._createClient= function( port, hostname, method, path, headers, sslEnabled ) {
  var options = {
    host: hostname,
    port: port,
    path: path,
    method: method,
    headers: headers
  };
  var httpModel;
  if( sslEnabled ) {
    httpModel= https;
  } else {
    httpModel= http;
  }
  return httpModel.request(options);
};

exports.OAuth.prototype._prepareParameters= function( oauth_token, oauth_token_secret, method, url$$1, extra_params ) {
  var oauthParameters= {
      "oauth_timestamp":        this._getTimestamp(),
      "oauth_nonce":            this._getNonce(this._nonceSize),
      "oauth_version":          this._version,
      "oauth_signature_method": this._signatureMethod,
      "oauth_consumer_key":     this._consumerKey
  };

  if( oauth_token ) {
    oauthParameters["oauth_token"]= oauth_token;
  }

  var sig;
  if( this._isEcho ) {
    sig = this._getSignature( "GET",  this._verifyCredentials,  this._normaliseRequestParams(oauthParameters), oauth_token_secret);
  }
  else {
    if( extra_params ) {
      for( var key in extra_params ) {
        if (extra_params.hasOwnProperty(key)) oauthParameters[key]= extra_params[key];
      }
    }
    var parsedUrl= url.parse( url$$1, false );

    if( parsedUrl.query ) {
      var key2;
      var extraParameters= querystring.parse(parsedUrl.query);
      for(var key in extraParameters ) {
        var value= extraParameters[key];
          if( typeof value == "object" ){
            // TODO: This probably should be recursive
            for(key2 in value){
              oauthParameters[key + "[" + key2 + "]"] = value[key2];
            }
          } else {
            oauthParameters[key]= value;
          }
        }
    }

    sig = this._getSignature( method,  url$$1,  this._normaliseRequestParams(oauthParameters), oauth_token_secret);
  }

  var orderedParameters= this._sortRequestParams( this._makeArrayOfArgumentsHash(oauthParameters) );
  orderedParameters[orderedParameters.length]= ["oauth_signature", sig];
  return orderedParameters;
};

exports.OAuth.prototype._performSecureRequest= function( oauth_token, oauth_token_secret, method, url$$1, extra_params, post_body, post_content_type,  callback ) {
  var orderedParameters= this._prepareParameters(oauth_token, oauth_token_secret, method, url$$1, extra_params);

  if( !post_content_type ) {
    post_content_type= "application/x-www-form-urlencoded";
  }
  var parsedUrl= url.parse( url$$1, false );
  if( parsedUrl.protocol == "http:" && !parsedUrl.port ) parsedUrl.port= 80;
  if( parsedUrl.protocol == "https:" && !parsedUrl.port ) parsedUrl.port= 443;

  var headers= {};
  var authorization = this._buildAuthorizationHeaders(orderedParameters);
  if ( this._isEcho ) {
    headers["X-Verify-Credentials-Authorization"]= authorization;
  }
  else {
    headers["Authorization"]= authorization;
  }

  headers["Host"] = parsedUrl.host;

  for( var key in this._headers ) {
    if (this._headers.hasOwnProperty(key)) {
      headers[key]= this._headers[key];
    }
  }

  // Filter out any passed extra_params that are really to do with OAuth
  for(var key in extra_params) {
    if( this._isParameterNameAnOAuthParameter( key ) ) {
      delete extra_params[key];
    }
  }

  if( (method == "POST" || method == "PUT")  && ( post_body == null && extra_params != null) ) {
    // Fix the mismatch between the output of querystring.stringify() and this._encodeData()
    post_body= querystring.stringify(extra_params)
                       .replace(/\!/g, "%21")
                       .replace(/\'/g, "%27")
                       .replace(/\(/g, "%28")
                       .replace(/\)/g, "%29")
                       .replace(/\*/g, "%2A");
  }

  if( post_body ) {
      if ( Buffer.isBuffer(post_body) ) {
          headers["Content-length"]= post_body.length;
      } else {
          headers["Content-length"]= Buffer.byteLength(post_body);
      }
  } else {
      headers["Content-length"]= 0;
  }

  headers["Content-Type"]= post_content_type;

  var path;
  if( !parsedUrl.pathname  || parsedUrl.pathname == "" ) parsedUrl.pathname ="/";
  if( parsedUrl.query ) path= parsedUrl.pathname + "?"+ parsedUrl.query ;
  else path= parsedUrl.pathname;

  var request;
  if( parsedUrl.protocol == "https:" ) {
    request= this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers, true);
  }
  else {
    request= this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers);
  }

  var clientOptions = this._clientOptions;
  if( callback ) {
    var data="";
    var self= this;

    // Some hosts *cough* google appear to close the connection early / send no content-length header
    // allow this behaviour.
    var allowEarlyClose= _utils.isAnEarlyCloseHost( parsedUrl.hostname );
    var callbackCalled= false;
    var passBackControl = function( response ) {
      if(!callbackCalled) {
        callbackCalled= true;
        if ( response.statusCode >= 200 && response.statusCode <= 299 ) {
          callback(null, data, response);
        } else {
          // Follow 301 or 302 redirects with Location HTTP header
          if((response.statusCode == 301 || response.statusCode == 302) && clientOptions.followRedirects && response.headers && response.headers.location) {
            self._performSecureRequest( oauth_token, oauth_token_secret, method, response.headers.location, extra_params, post_body, post_content_type,  callback);
          }
          else {
            callback({ statusCode: response.statusCode, data: data }, data, response);
          }
        }
      }
    };

    request.on('response', function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        data+=chunk;
      });
      response.on('end', function () {
        passBackControl( response );
      });
      response.on('close', function () {
        if( allowEarlyClose ) {
          passBackControl( response );
        }
      });
    });

    request.on("error", function(err) {
      if(!callbackCalled) {
        callbackCalled= true;
        callback( err );
      }
    });

    if( (method == "POST" || method =="PUT") && post_body != null && post_body != "" ) {
      request.write(post_body);
    }
    request.end();
  }
  else {
    if( (method == "POST" || method =="PUT") && post_body != null && post_body != "" ) {
      request.write(post_body);
    }
    return request;
  }

  return;
};

exports.OAuth.prototype.setClientOptions= function(options) {
  var key,
      mergedOptions= {},
      hasOwnProperty= Object.prototype.hasOwnProperty;

  for( key in this._defaultClientOptions ) {
    if( !hasOwnProperty.call(options, key) ) {
      mergedOptions[key]= this._defaultClientOptions[key];
    } else {
      mergedOptions[key]= options[key];
    }
  }

  this._clientOptions= mergedOptions;
};

exports.OAuth.prototype.getOAuthAccessToken= function(oauth_token, oauth_token_secret, oauth_verifier,  callback) {
  var extraParams= {};
  if( typeof oauth_verifier == "function" ) {
    callback= oauth_verifier;
  } else {
    extraParams.oauth_verifier= oauth_verifier;
  }

   this._performSecureRequest( oauth_token, oauth_token_secret, this._clientOptions.accessTokenHttpMethod, this._accessUrl, extraParams, null, null, function(error, data, response) {
         if( error ) callback(error);
         else {
           var results= querystring.parse( data );
           var oauth_access_token= results["oauth_token"];
           delete results["oauth_token"];
           var oauth_access_token_secret= results["oauth_token_secret"];
           delete results["oauth_token_secret"];
           callback(null, oauth_access_token, oauth_access_token_secret, results );
         }
   });
};

// Deprecated
exports.OAuth.prototype.getProtectedResource= function(url$$1, method, oauth_token, oauth_token_secret, callback) {
  this._performSecureRequest( oauth_token, oauth_token_secret, method, url$$1, null, "", null, callback );
};

exports.OAuth.prototype.delete= function(url$$1, oauth_token, oauth_token_secret, callback) {
  return this._performSecureRequest( oauth_token, oauth_token_secret, "DELETE", url$$1, null, "", null, callback );
};

exports.OAuth.prototype.get= function(url$$1, oauth_token, oauth_token_secret, callback) {
  return this._performSecureRequest( oauth_token, oauth_token_secret, "GET", url$$1, null, "", null, callback );
};

exports.OAuth.prototype._putOrPost= function(method, url$$1, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
  var extra_params= null;
  if( typeof post_content_type == "function" ) {
    callback= post_content_type;
    post_content_type= null;
  }
  if ( typeof post_body != "string" && !Buffer.isBuffer(post_body) ) {
    post_content_type= "application/x-www-form-urlencoded";
    extra_params= post_body;
    post_body= null;
  }
  return this._performSecureRequest( oauth_token, oauth_token_secret, method, url$$1, extra_params, post_body, post_content_type, callback );
};


exports.OAuth.prototype.put= function(url$$1, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
  return this._putOrPost("PUT", url$$1, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};

exports.OAuth.prototype.post= function(url$$1, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
  return this._putOrPost("POST", url$$1, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};

/**
 * Gets a request token from the OAuth provider and passes that information back
 * to the calling code.
 *
 * The callback should expect a function of the following form:
 *
 * function(err, token, token_secret, parsedQueryString) {}
 *
 * This method has optional parameters so can be called in the following 2 ways:
 *
 * 1) Primary use case: Does a basic request with no extra parameters
 *  getOAuthRequestToken( callbackFunction )
 *
 * 2) As above but allows for provision of extra parameters to be sent as part of the query to the server.
 *  getOAuthRequestToken( extraParams, callbackFunction )
 *
 * N.B. This method will HTTP POST verbs by default, if you wish to override this behaviour you will
 * need to provide a requestTokenHttpMethod option when creating the client.
 *
 **/
exports.OAuth.prototype.getOAuthRequestToken= function( extraParams, callback ) {
   if( typeof extraParams == "function" ){
     callback = extraParams;
     extraParams = {};
   }
  // Callbacks are 1.0A related
  if( this._authorize_callback ) {
    extraParams["oauth_callback"]= this._authorize_callback;
  }
  this._performSecureRequest( null, null, this._clientOptions.requestTokenHttpMethod, this._requestUrl, extraParams, null, null, function(error, data, response) {
    if( error ) callback(error);
    else {
      var results= querystring.parse(data);

      var oauth_token= results["oauth_token"];
      var oauth_token_secret= results["oauth_token_secret"];
      delete results["oauth_token"];
      delete results["oauth_token_secret"];
      callback(null, oauth_token, oauth_token_secret,  results );
    }
  });
};

exports.OAuth.prototype.signUrl= function(url$$1, oauth_token, oauth_token_secret, method) {

  if( method === undefined ) {
    var method= "GET";
  }

  var orderedParameters= this._prepareParameters(oauth_token, oauth_token_secret, method, url$$1, {});
  var parsedUrl= url.parse( url$$1, false );

  var query="";
  for( var i= 0 ; i < orderedParameters.length; i++) {
    query+= orderedParameters[i][0]+"="+ this._encodeData(orderedParameters[i][1]) + "&";
  }
  query= query.substring(0, query.length-1);

  return parsedUrl.protocol + "//"+ parsedUrl.host + parsedUrl.pathname + "?" + query;
};

exports.OAuth.prototype.authHeader= function(url$$1, oauth_token, oauth_token_secret, method) {
  if( method === undefined ) {
    var method= "GET";
  }

  var orderedParameters= this._prepareParameters(oauth_token, oauth_token_secret, method, url$$1, {});
  return this._buildAuthorizationHeaders(orderedParameters);
};
});
var oauth_1 = oauth.OAuth;
var oauth_2 = oauth.OAuthEcho;

var oauth2 = createCommonjsModule(function (module, exports) {
exports.OAuth2= function(clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders) {
  this._clientId= clientId;
  this._clientSecret= clientSecret;
  this._baseSite= baseSite;
  this._authorizeUrl= authorizePath || "/oauth/authorize";
  this._accessTokenUrl= accessTokenPath || "/oauth/access_token";
  this._accessTokenName= "access_token";
  this._authMethod= "Bearer";
  this._customHeaders = customHeaders || {};
  this._useAuthorizationHeaderForGET= false;

  //our agent
  this._agent = undefined;
};

// Allows you to set an agent to use instead of the default HTTP or
// HTTPS agents. Useful when dealing with your own certificates.
exports.OAuth2.prototype.setAgent = function(agent) {
  this._agent = agent;
};

// This 'hack' method is required for sites that don't use
// 'access_token' as the name of the access token (for requests).
// ( http://tools.ietf.org/html/draft-ietf-oauth-v2-16#section-7 )
// it isn't clear what the correct value should be atm, so allowing
// for specific (temporary?) override for now.
exports.OAuth2.prototype.setAccessTokenName= function ( name ) {
  this._accessTokenName= name;
};

// Sets the authorization method for Authorization header.
// e.g. Authorization: Bearer <token>  # "Bearer" is the authorization method.
exports.OAuth2.prototype.setAuthMethod = function ( authMethod ) {
  this._authMethod = authMethod;
};


// If you use the OAuth2 exposed 'get' method (and don't construct your own _request call )
// this will specify whether to use an 'Authorize' header instead of passing the access_token as a query parameter
exports.OAuth2.prototype.useAuthorizationHeaderforGET = function(useIt) {
  this._useAuthorizationHeaderForGET= useIt;
};

exports.OAuth2.prototype._getAccessTokenUrl= function() {
  return this._baseSite + this._accessTokenUrl; /* + "?" + querystring.stringify(params); */
};

// Build the authorization header. In particular, build the part after the colon.
// e.g. Authorization: Bearer <token>  # Build "Bearer <token>"
exports.OAuth2.prototype.buildAuthHeader= function(token) {
  return this._authMethod + ' ' + token;
};

exports.OAuth2.prototype._chooseHttpLibrary= function( parsedUrl ) {
  var http_library= https;
  // As this is OAUth2, we *assume* https unless told explicitly otherwise.
  if( parsedUrl.protocol != "https:" ) {
    http_library= http;
  }
  return http_library;
};

exports.OAuth2.prototype._request= function(method, url$$1, headers, post_body, access_token, callback) {

  var parsedUrl= url.parse( url$$1, true );
  if( parsedUrl.protocol == "https:" && !parsedUrl.port ) {
    parsedUrl.port= 443;
  }

  var http_library= this._chooseHttpLibrary( parsedUrl );


  var realHeaders= {};
  for( var key in this._customHeaders ) {
    realHeaders[key]= this._customHeaders[key];
  }
  if( headers ) {
    for(var key in headers) {
      realHeaders[key] = headers[key];
    }
  }
  realHeaders['Host']= parsedUrl.host;

  if (!realHeaders['User-Agent']) {
    realHeaders['User-Agent'] = 'Node-oauth';
  }

  if( post_body ) {
      if ( Buffer.isBuffer(post_body) ) {
          realHeaders["Content-Length"]= post_body.length;
      } else {
          realHeaders["Content-Length"]= Buffer.byteLength(post_body);
      }
  } else {
      realHeaders["Content-length"]= 0;
  }

  if( access_token && !('Authorization' in realHeaders)) {
    if( ! parsedUrl.query ) parsedUrl.query= {};
    parsedUrl.query[this._accessTokenName]= access_token;
  }

  var queryStr= querystring.stringify(parsedUrl.query);
  if( queryStr ) queryStr=  "?" + queryStr;
  var options = {
    host:parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + queryStr,
    method: method,
    headers: realHeaders
  };

  this._executeRequest( http_library, options, post_body, callback );
};

exports.OAuth2.prototype._executeRequest= function( http_library, options, post_body, callback ) {
  // Some hosts *cough* google appear to close the connection early / send no content-length header
  // allow this behaviour.
  var allowEarlyClose= _utils.isAnEarlyCloseHost(options.host);
  var callbackCalled= false;
  function passBackControl( response, result ) {
    if(!callbackCalled) {
      callbackCalled=true;
      if( !(response.statusCode >= 200 && response.statusCode <= 299) && (response.statusCode != 301) && (response.statusCode != 302) ) {
        callback({ statusCode: response.statusCode, data: result });
      } else {
        callback(null, result, response);
      }
    }
  }

  var result= "";

  //set the agent on the request options
  if (this._agent) {
    options.agent = this._agent;
  }

  var request = http_library.request(options);
  request.on('response', function (response) {
    response.on("data", function (chunk) {
      result+= chunk;
    });
    response.on("close", function (err) {
      if( allowEarlyClose ) {
        passBackControl( response, result );
      }
    });
    response.addListener("end", function () {
      passBackControl( response, result );
    });
  });
  request.on('error', function(e) {
    callbackCalled= true;
    callback(e);
  });

  if( (options.method == 'POST' || options.method == 'PUT') && post_body ) {
     request.write(post_body);
  }
  request.end();
};

exports.OAuth2.prototype.getAuthorizeUrl= function( params ) {
  var params= params || {};
  params['client_id'] = this._clientId;
  return this._baseSite + this._authorizeUrl + "?" + querystring.stringify(params);
};

exports.OAuth2.prototype.getOAuthAccessToken= function(code, params, callback) {
  var params= params || {};
  params['client_id'] = this._clientId;
  params['client_secret'] = this._clientSecret;
  var codeParam = (params.grant_type === 'refresh_token') ? 'refresh_token' : 'code';
  params[codeParam]= code;

  var post_data= querystring.stringify( params );
  var post_headers= {
       'Content-Type': 'application/x-www-form-urlencoded'
   };


  this._request("POST", this._getAccessTokenUrl(), post_headers, post_data, null, function(error, data, response) {
    if( error )  callback(error);
    else {
      var results;
      try {
        // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
        // responses should be in JSON
        results= JSON.parse( data );
      }
      catch(e) {
        // .... However both Facebook + Github currently use rev05 of the spec
        // and neither seem to specify a content-type correctly in their response headers :(
        // clients of these services will suffer a *minor* performance cost of the exception
        // being thrown
        results= querystring.parse( data );
      }
      var access_token= results["access_token"];
      var refresh_token= results["refresh_token"];
      delete results["refresh_token"];
      callback(null, access_token, refresh_token, results); // callback results =-=
    }
  });
};

// Deprecated
exports.OAuth2.prototype.getProtectedResource= function(url$$1, access_token, callback) {
  this._request("GET", url$$1, {}, "", access_token, callback );
};

exports.OAuth2.prototype.get= function(url$$1, access_token, callback) {
  if( this._useAuthorizationHeaderForGET ) {
    var headers= {'Authorization': this.buildAuthHeader(access_token) };
    access_token= null;
  }
  else {
    headers= {};
  }
  this._request("GET", url$$1, headers, "", access_token, callback );
};
});
var oauth2_1 = oauth2.OAuth2;

var OAuth = oauth.OAuth;
var OAuthEcho = oauth.OAuthEcho;
var OAuth2 = oauth2.OAuth2;

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
    constructor(options = {}) {
        super(options);
        this.options = options;
    }
    /**
     * Loads the Twitter API.
     * @private
     * @returns {Promise}
     */
    _handleLoadApi() {
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
    _fetchAppToken() {
        var oauth2 = new OAuth2(this.options.apiKey, this.options.apiSecret, 'https://api.twitter.com/', null, 'oauth2/token', null);
        return new Promise((resolve, reject) => {
            oauth2.getOAuthAccessToken('', { 'grant_type': 'client_credentials' }, function (e, access_token, refresh_token, results) {
                if (e) {
                    console.log('ERROR: ' + e);
                    reject(e);
                }
                else {
                    resolve(access_token);
                }
            });
        });
    }
    /**
     * Fetches the a user's access token using OAuth which is needed to utilize the social network's API methods.
     * @returns {Promise.<string>}
     * @private
     */
    _fetchUserAccessToken() {
        var oauth = new OAuth('https://api.twitter.com/oauth/request_token', 'https://api.twitter.com/oauth/access_token', this.options.apiKey, this.options.apiSecret, '1.0A', null, 'HMAC-SHA1');
        return new Promise((resolve, reject) => {
            oauth.getOAuthRequestToken((err, token, secret) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        token: token,
                        secret: secret
                    });
                }
            });
        });
    }
    /**
     * Logs a user into twitter.
     * @param options
     * @returns {Promise.<{Object}>} Returns a promise when user has logged in successfully and have approved all the permissions
     * @returns {Promise.<{Object}>.String} accessToken
     * @returns {Promise.<{Object}>.Number} userId
     * @returns {Promise.<{Object}>.Date} expiresAt
     */
    login(options = {}) {
        return this.load().then(() => {
            return this._fetchUserAccessToken().then((result) => {
                return {
                    accessToken: result.token,
                    accessTokenSecret: result.secret
                };
            });
        });
    }
    static get id() {
        return 'twitter';
    }
}

/**
 * Vine API-loading class.
 * @class Vine
 */
class Vine extends BaseApi {
    /**
     * Loads the Vine API.
     * @private
     */
    _handleLoadApi() {
        return this._loadScript('//platform.vine.co/static/scripts/embed.js');
    }
    static get id() {
        return 'vine';
    }
}

export { Facebook, Instagram, Tumblr, Twitter, Vine };
