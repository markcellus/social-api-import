import BaseApi, { ApiInitOptions } from './base-api';

interface TumblrApiOptions extends ApiInitOptions {
    'base-hostname': string;
    api_key: string
}

export default class Tumblr extends BaseApi {

    protected options: TumblrApiOptions;

    constructor (options: TumblrApiOptions = {
        'base-hostname': undefined,
        api_key: undefined
    }) {
        super(options);
        if (!options['base-hostname']) {
            throw Error('Tumblr constructor needs to be passed a "base-hostname" option');
        }
        options.api_key = options.api_key || '';
    }

    static get id () {
        return 'tumblr';
    }

    protected async handleLoadApi () {
        const callbackMethod = 'onTumblrReady';

        // we're arbitrarily choosing the "/posts" endpoint to prevent getting a 404 error
        const scriptUrl =
            '//api.tumblr.com/v2/blog/' + this.options['base-hostname'] + '/posts?' +
            'api_key=' + this.options.api_key + '&' +
            'callback=' + callbackMethod;

        return new Promise((resolve) => {
            window[callbackMethod] = resolve;
            this.loadScript(scriptUrl);
        })
    }

}
