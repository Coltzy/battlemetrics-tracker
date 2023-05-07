import { BMErrors } from '../types/BMError';
import { Server, ServerSearch } from '../types/servers';
import fetch from 'node-fetch';
import qs from 'querystring';
import 'dotenv/config';

const ENDPOINT = 'https://api.battlemetrics.com/';

class BMF {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public async fetch(method: string, options?: { [key: string]: string }) {
        return await this.direct_fetch(this.uri(method, options));
    }

    public async direct_fetch(uri: string) {
        const response = await fetch(uri, {
            headers: {
                "Authorization": process.env.BATTLEMETRICS_TOKEN as string
            }
        });

        return await response.json();
    }

    public uri(method: string, options?: { [key: string]: string }) {
        let uri = ENDPOINT + method;

        if (options) {
            uri += '?' + qs.stringify(options);
        }

        return uri;
    }

    public async searchServers(query: string, limit = 100) {
        if (limit < 1 && limit > 100) throw new Error('Invalid limit for `searchServers`');

        const response = await this.fetch('servers', {
            'filter[search]': query,
            'page[size]': limit.toString()
        }) as ServerSearch;

        if ('data' in response) {
            return response.data;
        }

        return undefined;
    }

    public async getServer(query: string) {
        let response: BMErrors | Server | Server[] | undefined = undefined;

        let success = false;

        if (!isNaN(Number(query))) {
            response = await this.fetch(`servers/${query}`) as BMErrors | Server;

            if ('data' in response) {
                success = true;
            }
        }

        if (success) {
            return response as Server;
        }

        const res = await this.searchServers(query, 1);

        if (res && res.length) {
            response = { data: res[0] };

            return response;
        }

        return undefined;
    }
}

export default BMF;