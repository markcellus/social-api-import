import BaseApi from './base-api';

export default class Vine extends BaseApi {
    protected async handleLoadApi () {
        return this.loadScript('//platform.vine.co/static/scripts/embed.js');
    }

    static get id () {
        return 'vine';
    }

}