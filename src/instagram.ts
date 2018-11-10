import BaseApi from './base-api';

declare global {
    interface Window {
        instgrm: any;
    }
}

export default class Instagram extends BaseApi {

    static get id () {
        return 'instagram';
    }

    protected async handleLoadApi () {
        await this.loadScript('//platform.instagram.com/en_US/embeds.js');
            // must manually process instagram embed
            window.instgrm.Embeds.process();
            return window.instgrm;
    }

}