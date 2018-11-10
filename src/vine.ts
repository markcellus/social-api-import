import BaseApi from './base-api';

/**
 * Vine API-loading class.
 * @class Vine
 */
class Vine extends BaseApi {

    /**
     * Loads the Vine API.
     * @private
     */
    _handleLoadApi () {
        return this._loadScript('//platform.vine.co/static/scripts/embed.js');
    }

    static get id () {
        return 'vine';
    }

}

export default Vine;
