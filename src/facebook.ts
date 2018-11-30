import BaseApi, {
    InitOptions as BaseInitOptions,
    UserAccessCredentials,
    PermissionsMap,
    LoginOptions as BaseLoginOptions
} from './base-api';
import FacebookInitParams = facebook.InitParams;
import FacebookLoginOptions = facebook.LoginOptions;
import StatusResponse = facebook.StatusResponse;

declare global {
    interface Window {
        fbAsyncInit: () => void;
    }
}

const PERMISSIONS_MAP: PermissionsMap = {
    createPosts: ['publish_actions'],
    readPosts: ['user_posts'],
    updatePosts: ['publish_actions'],
    deletePosts: ['publish_actions'],
    readProfile: ['public_profile', 'user_about_me', 'user_birthday', 'user_location', 'user_work_history'],
    readFriendProfiles: ['user_friends']
};

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

    async login(options: LoginOptions = {}): Promise<UserAccessCredentials> {
        await this.load();
        const buildScope = () => {
            options.permissions = options.permissions || [];
            return options.permissions.reduce((prev = '', perm) => {
                const values: Array<FacebookLoginOptions['scope']> = PERMISSIONS_MAP[perm] || [];
                return values.reduce((p, value) => {
                    const delimiter = prev ? ',' : '';
                    let str = value || '';
                    if (prev.indexOf(value || '') === -1) {
                        str = `${delimiter}${value}`;
                        return (prev += str);
                    } else {
                        return prev;
                    }
                }, prev);
            }, '');
        };

        options.scope = options.scope || buildScope();

        return new Promise<UserAccessCredentials>(resolve => {
            this.FB.login((response: StatusResponse) => {
                if (response.authResponse) {
                    // authorized!
                    resolve({
                        accessToken: response.authResponse.accessToken,
                        userId: response.authResponse.userID,
                        expiresAt: response.authResponse.expiresIn
                    } as UserAccessCredentials);
                } else {
                    // User either abandoned the login flow or,
                    // for some other reason, did not fully authorize
                    resolve({} as UserAccessCredentials);
                }
            }, options);
        });
    }

    static get id() {
        return 'facebook';
    }

    destroy() {
        delete window.fbAsyncInit;
        return super.destroy();
    }

    protected async handleLoadApi() {
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
