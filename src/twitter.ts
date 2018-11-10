import { OAuth, oauth1tokenCallback, OAuth2 } from 'oauth';
import BaseApi, { ApiInitOptions, ApiUserAccessCredentials } from './base-api';

declare global {
    interface Window {
        twttr: any;
    }
}

interface TwitterUserAccessToken {
    token: string,
    secret: string
}

export default class Twitter extends BaseApi {

    protected options: ApiInitOptions;

    async login (options: ApiUserAccessCredentials) {
        await this.load();
        const result = await this.fetchUserAccessToken();
        return {
            accessToken: result.token,
            accessTokenSecret: result.secret
        }
    }

    protected async handleLoadApi () {
        window.twttr = window.twttr || {};
        window.twttr._e = [];
        window.twttr.ready = (f) => {
            window.twttr._e.push(f);
        };
        return new Promise((resolve) => {
            window.twttr.ready((twttr) => {
                resolve(twttr);
            });
            this.loadScript('https://platform.twitter.com/widgets.js');
        });
    }


    /**
     * Gets Twitter's application-level "bearer" token necessary to use the API, without a user context.
     */
    private async fetchAppToken () {
        const oauth2 = new OAuth2(
            this.options.apiKey,
            this.options.apiSecret,
            'https://api.twitter.com/',
            null,
            'oauth2/token',
            null);

        return new Promise((resolve, reject) => {
            oauth2.getOAuthAccessToken(
                '',
                {'grant_type':'client_credentials'},
                 (e, accessToken) => {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(accessToken);
                    }
                });
        });
    }

    private async fetchUserAccessToken (): Promise<TwitterUserAccessToken> {
        const oauth = new OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            this.options.apiKey,
            this.options.apiSecret,
            '1.0A',
            null,
            'HMAC-SHA1'
        );
        return new Promise<TwitterUserAccessToken>((resolve, reject) => {
            oauth.getOAuthRequestToken((err, token, secret) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        token,
                        secret
                    });
                }
            });
        })
    }

    static get id () {
        return 'twitter';
    }
}
