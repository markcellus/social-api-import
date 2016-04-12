'use strict';
import BaseApi from './base-api';

/**
 * Vine API-loading class.
 * @class Vine
 */
class Vine extends BaseApi {

    /**
     * Loads the Vine API.
     * @param {Object} options - load options
     * @param {Function} [callback] - Fires when the FB SDK has been loaded passed the FB object
     */
    load (options, callback) {
        options = options || {};
        options.scriptUrl = options.scriptUrl || '//platform.vine.co/static/scripts/embed.js';
        this.options = options;
        this.loadApi(callback);
    }

    /**
     * Fires callback when API has been loaded.
     * @param {Function} cb - The callback
     * @private
     */
    _handleLoadApi (cb) {
        this.loadScript(this.options.scriptUrl, 'vine-js', cb);
    }

}

export default new Vine();
