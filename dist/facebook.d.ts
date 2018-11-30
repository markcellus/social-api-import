/// <reference types="facebook-js-sdk" />
import BaseApi, { InitOptions as BaseInitOptions, UserAccessCredentials, LoginOptions as BaseLoginOptions } from './base-api';
import FacebookInitParams = facebook.InitParams;
import FacebookLoginOptions = facebook.LoginOptions;
declare global {
    interface Window {
        fbAsyncInit: () => void;
    }
}
export declare type InitOptions = BaseInitOptions & FacebookInitParams;
export declare type LoginOptions = BaseLoginOptions & FacebookLoginOptions;
export default class Facebook extends BaseApi {
    protected options: InitOptions;
    private FB;
    constructor(options: InitOptions);
    login(options?: LoginOptions): Promise<UserAccessCredentials>;
    static readonly id: string;
    destroy(): void;
    protected handleLoadApi(): Promise<{}>;
}
