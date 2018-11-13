import { script } from 'dynamic-import';

export interface ApiInitOptions {
    apiVersion?: string | number;
    apiKey?: string;
    apiSecret?: string;
    callbackUrl?: string
}

export interface ApiUserAccessCredentials {
    accessToken: string,
    accessTokenSecret: string,
    userId?: string,
    expiresAt?: Date
}

export interface ApiLoginOptions {
    permissions?: string[],
    scope?: string
}

const loadedScripts: string[] = [];

export default abstract class BaseApi {
    
    protected options: ApiInitOptions;
    private script?: string;
    private loadApiListenerPromiseMap: Promise<void>;

    constructor (options: ApiInitOptions) {
        this.options = options;
    }

    destroy () {
        const idx = loadedScripts.indexOf(this.script);
        loadedScripts.splice(idx, 1);
        if (this.script && loadedScripts.indexOf(this.script) <= -1) {
            script.unload(this.script);
        }
    }

    async load () {
        if (!this.loadApiListenerPromiseMap) {
            this.loadApiListenerPromiseMap = this.handleLoadApi(this.options);
        }
        return this.loadApiListenerPromiseMap;
    }

    protected async login (options: ApiLoginOptions): Promise<ApiUserAccessCredentials> {
       return {
           accessToken: '',
           accessTokenSecret: '',
           userId: '',
           expiresAt: null
       }
    }

    protected loadScript (path: string) {
        this.script = path;
        loadedScripts.push(this.script);
        return script.import(this.script);
    }
    

    protected async handleLoadApi (options: ApiInitOptions): Promise<any> {
        return Promise.resolve();
    }

    static get id () {
        return 'base-api';
    }
    
}
