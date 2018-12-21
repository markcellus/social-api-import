import BaseApi from './base-api';

declare global {
    interface Window {
        twttr: any;
    }
}

export default class Twitter extends BaseApi {
    protected async handleLoadApi() {
        window.twttr = window.twttr || {};
        window.twttr._e = [];
        window.twttr.ready = f => {
            window.twttr._e.push(f);
        };
        return new Promise(resolve => {
            window.twttr.ready(twttr => {
                resolve(twttr);
            });
            this.loadScript('https://platform.twitter.com/widgets.js');
        });
    }

    static get id() {
        return 'twitter';
    }
}
