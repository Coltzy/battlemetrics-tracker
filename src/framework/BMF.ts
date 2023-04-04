import fetch from 'node-fetch';
import qs from 'querystring';
import 'dotenv/config';

const ENDPOINT = 'https://api.battlemetrics.com/';

class BMF {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public async fetch(method: string, id: string, options?: { [key: string]: string }) {
        console.log(this.uri(method, id, options));
        const response = await fetch(this.uri(method, id, options), {
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