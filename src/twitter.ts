import BaseApi, { InitOptions as BaseInitOptions } from './base-api';

declare global {
    interface Window {
        twttr: any;
    }
}

interface InitOptions extends BaseInitOptions {
    apiKey: string;
    apiSecret: string;
}

export default class Twitter extends BaseApi {
    protected options: InitOptions = {
        apiKey: '',
        apiSecret: ''
    };

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
