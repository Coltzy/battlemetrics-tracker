import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { inlineCode } from '@discordjs/builders';
import Logger from '../../Logger';
import Util from '../../Util';
import 'moment-duration-format';
import { Server } from '../../types/servers';
import ServerIsonlineBuilder from '../../builders/server/builder-isonline';

class ServerIsonlineCommand implements Command {
    public name = 'server-isonline';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        /* TODO: refactor */
        const server = interaction.options.get('server')?.value as string;
        const player = interaction.options.get('player')?.value as string;
        let response;
        
        try {
            response = await Util.searchServer(interaction.client, server);
        } catch (err) {
            Logger.error('There was an error when fetching from battlemetrics.');
            console.error(err);

            interaction.reply('There was an error when fetching this data.');
            return;
        }

        if (!response) {
            await interaction.reply(`No search results were found for ${inlineCode(server)}`);

            return;
        }

        let res;
        
        try {
            res = await interaction.client.BMF.fetch(`servers/${response.data.id}`, {
                'include': 'player'
            }) as Server;
        } catch (err) {
            Logger.error('There was an error when fetching from battlemetrics.');
            console.error(err);

            interaction.reply('There was an error when fetching this data.');
            return;
        }

        if ('errors' in res) {
            await interaction.reply('There was an error when fetching the player data.');
        }

        const filtered = res.included?.filter((p) => p.attributes.name.toLowerCase() == player.toLowerCase());

        if (filtered?.length) {
            new ServerIsonlineBuilder(interaction, response, filtered);
        } else {
            await interaction.reply('No players are online that go by this name.');
        }
    }
}

export default ServerIsonlineCommand;