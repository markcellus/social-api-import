import BaseApi from '../base-api';

declare global {
    interface Window {
        googlePlusOnLoadCallback: any;
    }
}

export default class GooglePlus extends BaseApi {
    private gapi?: any;

    static get id() {
        return 'google-plus';
    }

    protected async handleLoadApi(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            window.googlePlusOnLoadCallback = () => {
                gapi.load('auth2', () => {
                    this.gapi = gapi;
                    resolve(gapi);
                });
            };
            try {
                await this.loadScript('https://apis.google.com/js/platform.js?onload=googlePlusOnLoadCallback');
            } catch (e) {
                reject(e);
            }
        });
    }
}
