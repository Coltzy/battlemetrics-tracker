import { BMErrors } from '../types/BMError';
import { Server, ServerSearch } from '../types/servers';
import { Client } from 'discord.js';
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

    public async searchServer(query: string) {
        let response: BMErrors | Server | ServerSearch | undefined = undefined;

        let success = false;

        if (!isNaN(Number(query))) {
            response = await this.fetch(`servers/${query}`) as BMErrors | Server;

            if ('data' in response) {
                success = true;
            }
        }

        if (!success) {
            response = await this.fetch('servers', {
                'filter[search]': query,
                'page[size]': '1'
            });
        }

        if (response && 'data' in response && Array.isArray(response.data)) {
            response = response.data[0] ? { data: response.data[0] } : undefined;
        }

        return response as Server | undefined;
    }
}

export default BMF;