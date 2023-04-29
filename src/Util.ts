import { Client, CommandInteraction, InteractionReplyOptions } from 'discord.js';
import { BMErrors } from './types/BMError';
import { Server, ServerSearch } from './types/servers';

class Util {
    static async reply(interaction: CommandInteraction, options: InteractionReplyOptions | string) {
        if (interaction.replied) {
            await interaction.editReply(options);

            return;
        }

        await interaction.reply(options);
    }

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

    static serverToUrl(server: Server) {
        return `https://www.battlemetrics.com/servers/${server.data.relationships.game.data.id}/${server.data.id}`;
    }
}

export default Util;