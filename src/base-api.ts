import { script } from 'dynamic-import';

export interface InitOptions {
    version?: string;
    apiKey?: string;
    apiSecret?: string;
    apiVersion?: string | number; // TODO: Deprecated, remove in next major version
}

export interface LoginOptions {
    permissions?: Permission[];
}

export type Permission =
    | 'createPosts'
    | 'readPosts'
    | 'updatePosts'
    | 'deletePosts'
    | 'readProfile'
    | 'readFriendProfiles';

export interface PermissionsMap {
    createPosts: Array<'publish_actions'>;
    readPosts: Array<'user_posts'>;
    updatePosts: Array<'publish_actions'>;
    deletePosts: Array<'publish_actions'>;
    readProfile: Array<'public_profile' | 'user_about_me' | 'user_birthday' | 'user_location' | 'user_work_history'>;
    readFriendProfiles: Array<'user_friends'>;
}

const loadedScripts: string[] = [];

export default abstract class BaseApi {
    protected options: InitOptions;
    private script?: string;
    private loadApiListenerPromiseMap?: Promise<void>;

    constructor(options: InitOptions = {}) {
        if (options.apiVersion) {
            console.warn(`"apiVersion" has been deprecated, please use the "version" option`);
            options.version = options.apiVersion + '';
        }
        this.options = options;
    }

    destroy() {
        if (!this.script) return;
        const idx = loadedScripts.indexOf(this.script);
        loadedScripts.splice(idx, 1);
        if (this.script && loadedScripts.indexOf(this.script) <= -1) {
            script.unload(this.script);
        }
    }

    async load() {
        if (!this.loadApiListenerPromiseMap) {
            this.loadApiListenerPromiseMap = this.handleLoadApi(this.options);
        }
        return this.loadApiListenerPromiseMap;
    }

    protected loadScript(path: string) {
        this.script = path;
        loadedScripts.push(this.script);
        return script.import(this.script);
    }

    protected async handleLoadApi(options: InitOptions): Promise<any> {
        return Promise.resolve();
    }

    static get id() {
        return 'base-api';
    }
}
