import BaseApi, { InitOptions as BaseInitOptions, LoginOptions } from './base-api';
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
    protected options: InitOptions;
    login(options: LoginOptions): Promise<{
        accessToken: string;
        accessTokenSecret: string;
    }>;
    protected handleLoadApi(): Promise<{}>;
    /**
     * Gets Twitter's application-level "bearer" token necessary to use the API, without a user context.
     */
    private fetchAppToken;
    private fetchUserAccessToken;
    static readonly id: string;
}
export {};
