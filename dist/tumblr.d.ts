import BaseApi, { InitOptions } from './base-api';
declare global {
    interface Window {
        onTumblrReady: () => void;
    }
}
interface TumblrApiOptions extends InitOptions {
    'base-hostname': string;
    api_key: string;
}
export default class Tumblr extends BaseApi {
    protected options: TumblrApiOptions;
    constructor(options: TumblrApiOptions);
    static readonly id: string;
    protected handleLoadApi(): Promise<{}>;
}
export {};
