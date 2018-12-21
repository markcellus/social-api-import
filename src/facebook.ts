import BaseApi, { InitOptions as BaseInitOptions, PermissionsMap, LoginOptions as BaseLoginOptions } from './base-api';
import FacebookInitParams = facebook.InitParams;
import FacebookLoginOptions = facebook.LoginOptions;

declare global {
    interface Window {
        fbAsyncInit: () => void;
    }
}

export type InitOptions = BaseInitOptions & FacebookInitParams;

export type LoginOptions = BaseLoginOptions & FacebookLoginOptions;

export default class Facebook extends BaseApi {
    protected options: InitOptions;
    private FB: any;

    constructor(options: InitOptions) {
        super(options);
        if (options.version) {
            options.version = !options.version.startsWith('v') ? 'v' + options.version : options.version;
        }
        options.xfbml = options.xfbml || true;
        this.options = options;
    }

    static get id() {
        return 'facebook';
    }

    destroy() {
        delete window.fbAsyncInit;
        return super.destroy();
    }

    protected async handleLoadApi(): Promise<any> {
        return new Promise(resolve => {
            window.fbAsyncInit = () => {
                FB.init(this.options);
                this.FB = FB;
                resolve(FB);
            };
            this.loadScript('https://connect.facebook.net/en_US/sdk.js');
        });
    }
}
