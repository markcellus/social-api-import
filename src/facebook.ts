import BaseApi, { ApiInitOptions, ApiUserAccessCredentials, ApiLoginOptions } from './base-api';
import InitParams = facebook.InitParams;

declare global {
    interface Window {
        fbAsyncInit: () => void;
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

interface FacebookApiOptions extends ApiInitOptions, InitParams {
    appId: string;
    xfbml?: boolean;
    version?: string;
    scope?: string;
}

export default class Facebook extends BaseApi {

    protected options: FacebookApiOptions;
    private FB: any;

    constructor (options: FacebookApiOptions = { appId: undefined}) {
        if (options.version) {
            options.version = options.version.split('v')[1];
        }
        options.apiVersion = options.apiVersion || options.version || 3.0;
        options.xfbml = options.xfbml || true;
        super(options);
    }

    async login (options: ApiLoginOptions = {}): Promise<ApiUserAccessCredentials> {
        await this.load();
        const buildScope = () => {
            options.permissions = options.permissions || [];
            return options.permissions.reduce((prev, perm) => {
                const values = PERMISSIONS_MAP[perm] || [];
                return values.reduce((p, value) => {
                    const delimiter = prev ? ',' : '';
                    let str = value || '';
                    if (prev.indexOf(value) === -1) {
                        str = `${delimiter}${value}`;
                    } else {
                        return prev;
                    }
                    return prev += str;
                }, prev);
            }, '');
        };

        options.scope = options.scope || buildScope();

        return new Promise<ApiUserAccessCredentials>((resolve) => {
            this.FB.login((response) => {
                if (response.authResponse) {
                    // authorized!
                    resolve({
                        accessToken: response.authResponse.accessToken,
                        userId: response.authResponse.userID,
                        expiresAt: response.authResponse.expiresIn
                    } as ApiUserAccessCredentials);
                } else {
                    // User either abandoned the login flow or,
                    // for some other reason, did not fully authorize
                    resolve({} as ApiUserAccessCredentials);
                }
            }, options);
        });
    }

    static get id () {
        return 'facebook';
    }

    destroy () {
        delete window.fbAsyncInit;
        return super.destroy();
    }

    protected async handleLoadApi () {
        return new Promise((resolve) => {
            window.fbAsyncInit = () => {
                this.options.version = 'v' + this.options.apiVersion;
                FB.init(this.options);
                this.FB = FB;
                resolve(FB);
            };
            this.loadScript('https://connect.facebook.net/en_US/sdk.js');
        });
    }

}