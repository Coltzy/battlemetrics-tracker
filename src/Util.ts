import { Client } from 'discord.js';
import { BMErrors } from './types/BMError';
import { Server, ServerSearch } from './types/servers';

class Util {
    static async searchServer(client: Client, query: string) {
        let response: BMErrors | Server | ServerSearch | undefined = undefined;

        let success = false;

        if (!isNaN(Number(query))) {
            response = await client.BMF.fetch(`servers/${query}`) as BMErrors | Server;

            if ('data' in response) {
                success = true;
            }
        }

        if (!success) {
            response = await client.BMF.fetch('servers', {
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

export default Util;