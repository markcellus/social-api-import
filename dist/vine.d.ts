import BaseApi from './base-api';
export default class Vine extends BaseApi {
    protected handleLoadApi(): Promise<any[]>;
    static readonly id: string;
}
