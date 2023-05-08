import { Server } from '../types/servers';
import { Player } from '../types/players';
import fetch from 'node-fetch';
import qs from 'querystring';
import 'dotenv/config';

const ENDPOINT = 'https://api.battlemetrics.com/';

type SearchMethod = 'servers' | 'players';

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

    search(method: 'servers', query: string, limit?: number): Promise<Server[] | undefined>;
    search(method: 'players', query: string, limit?: number): Promise<Player[] | undefined>;
    public async search(method: SearchMethod, query: string, limit = 100) {
        if (limit < 1 && limit > 100) throw new Error('Invalid limit for search.');

        const response = await this.fetch(method, {
            'filter[search]': query,
            'page[size]': limit.toString()
        });

        if ('data' in response) {
            return response.data.map((data: unknown) => new Object({ data }));
        }

        return undefined;
    }


    get(method: 'servers', query: string): Promise<Server | undefined>;
    get(method: 'players', query: string): Promise<Player | undefined>;
    public async get(method: SearchMethod, query: string) {
        let response = undefined;

        let success = false;

        const regex = new RegExp(/battlemetrics\.com\/(?:servers|players)\/(.*)/);
        const match = query.match(regex);

        if (match) {
            query = match[1];
        }

        if (!isNaN(Number(query))) {
            response = await this.fetch(`${method}/${query}`);

            if (response && 'data' in response) {
                success = true;
            }
        }

        if (success) {
            return response;
        }

        if (method == 'servers') {
            response = await this.search('servers', query, 1);
        } else {
            response = await this.search('players', query, 1);
        }

        if (response && response.length) {
            return response[0];
        }

        return undefined;
    }
}

export default BMF;