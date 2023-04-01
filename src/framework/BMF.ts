import fetch from 'node-fetch';
import 'dotenv/config';

const ENDPOINT = 'https://api.battlemetrics.com';

class BMF {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public async fetch(method: string, id: string) {
        const response = await fetch(this.uri(method, id), {
            headers: {
                "Authorization": process.env.BATTLEMETRICS_TOKEN as string
            }
        });

        return await response.json();
    }

    public uri(method: string, id: string) {
        return `${ENDPOINT}/${method}/${id}`;
    }
}

export default BMF;