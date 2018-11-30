export interface InitOptions {
    version?: string;
    apiKey?: string;
    apiSecret?: string;
    apiVersion?: string | number;
}
export interface UserAccessCredentials {
    accessToken: string;
    accessTokenSecret?: string;
    userId?: string;
    expiresAt?: number;
}
export interface LoginOptions {
    permissions?: Permission[];
}
export declare type Permission = 'createPosts' | 'readPosts' | 'updatePosts' | 'deletePosts' | 'readProfile' | 'readFriendProfiles';
export interface PermissionsMap {
    createPosts: Array<'publish_actions'>;
    readPosts: Array<'user_posts'>;
    updatePosts: Array<'publish_actions'>;
    deletePosts: Array<'publish_actions'>;
    readProfile: Array<'public_profile' | 'user_about_me' | 'user_birthday' | 'user_location' | 'user_work_history'>;
    readFriendProfiles: Array<'user_friends'>;
}
export default abstract class BaseApi {
    protected options: InitOptions;
    private script?;
    private loadApiListenerPromiseMap?;
    constructor(options?: InitOptions);
    destroy(): void;
    load(): Promise<void>;
    protected login(options: LoginOptions): Promise<UserAccessCredentials>;
    protected loadScript(path: string): Promise<any[]>;
    protected handleLoadApi(options: InitOptions): Promise<any>;
    static readonly id: string;
}
