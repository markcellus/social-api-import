import BaseApi from './base-api';
declare global {
    interface Window {
        instgrm: any;
    }
}
export default class Instagram extends BaseApi {
    static readonly id: string;
    protected handleLoadApi(): Promise<any>;
}
