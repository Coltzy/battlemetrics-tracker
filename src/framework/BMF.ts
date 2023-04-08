import fetch from 'node-fetch';
import qs from 'querystring';
import 'dotenv/config';

const ENDPOINT = 'https://api.battlemetrics.com/';

class BMF {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public async fetch(method: string, id: string, options?: { [key: string]: string }) {
        return await this.direct_fetch(this.uri(method, id, options));
    }

    public async direct_fetch(uri: string) {
        const response = await fetch(uri, {
            headers: {
                "Authorization": process.env.BATTLEMETRICS_TOKEN as string
            }
        });

        return await response.json();
    }

    public uri(method: string, id: string, options?: { [key: string]: string }) {
        let uri = (ENDPOINT + method).replace(/{ID}/, id);

        if (options) {
            uri += '?' + qs.stringify(options);
        }

        return uri;
    }
}

export default BMF;