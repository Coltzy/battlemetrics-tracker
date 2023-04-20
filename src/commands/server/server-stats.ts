import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { inlineCode } from '@discordjs/builders';
import Logger from '../../Logger';
import { Server, RustServerData, ArkServerData, CsgoServerData, ServerSearch, MinecraftServerData } from '../../types/servers';
import { BMErrors } from '../../types/BMError';
import 'moment-duration-format';

import RustServerStatsBuilder from '../../builders/stats/rust-stats';
import ArkServerStatsBuilder from '../../builders/stats/ark-stats';
import CsgoServerStatsBuilder from '../../builders/stats/csgo-stats';
import MinecraftServerStatsBuilder from '../../builders/stats/minecraft-stats';

class ServerStatsCommand implements Command {
    public name = 'server-stats';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        let response: BMErrors | Server | ServerSearch | undefined = undefined;

        try {
            let success = false;

            if (!isNaN(Number(query))) {
                response = await interaction.client.BMF.fetch(`servers/${query}`) as BMErrors | Server;

                if ('data' in response) {
                    success = true;
                }
            }

            if (!success) {
                response = await interaction.client.BMF.fetch('servers', {
                    'filter[search]': query,
                    'page[size]': '1'
                });
            }
        } catch (err) {
            Logger.error('There was an error when fetching from battlemetrics.');
            console.error(err);

            interaction.reply('There was an unexpected error when fetching this data.');
            return;
        }

        if (!response) return;

        if ('data' in response && Array.isArray(response.data)) {
            if (!response.data.length) {
                interaction.reply(`The search for ${inlineCode(query)} didn't find any results.`);

                return;
            }

            response = { data: response.data[0] };
        }

        const { data: server } = response as Server;

        if (server.relationships.game.data.id == 'rust') {
            new RustServerStatsBuilder(interaction, server as RustServerData);
        } else if (server.relationships.game.data.id == 'ark') {
            new ArkServerStatsBuilder(interaction, server as ArkServerData);
        } else if (server.relationships.game.data.id == 'csgo') {
            new CsgoServerStatsBuilder(interaction, server as CsgoServerData);
        } else if (server.relationships.game.data.id == 'minecraft') {
            new MinecraftServerStatsBuilder(interaction, server as MinecraftServerData);
        } else {
            interaction.reply(`Server's from ${server.relationships.game.data.id} are currently not supported!`);
        }
    }
}

export default ServerStatsCommand;