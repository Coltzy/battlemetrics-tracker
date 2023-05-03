import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { inlineCode } from '@discordjs/builders';
import Util from '../../Util';
import { Server } from '../../types/servers';
import ServerIsonlineBuilder from '../../builders/server/builder-server-isonline';

class ServerIsonlineCommand implements Command {
    public name = 'server-isonline';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const server = interaction.options.get('server')?.value as string;
        const player = interaction.options.get('player')?.value as string;
        const response = await Util.searchServer(interaction.client, server);

        if (!response) {
            await Util.reply(interaction, `No search results were found for ${inlineCode(server)}`);

            return;
        }

        const res = await interaction.client.BMF.fetch(`servers/${response.data.id}`, {
            'include': 'player'
        }) as Server;

        if ('errors' in res) {
            await Util.reply(interaction, 'There was an error when fetching the player data.');

            return;
        }

        const filtered = res.included?.filter((p) => p.attributes.name.toLowerCase() == player.toLowerCase());

        if (filtered?.length) {
            new ServerIsonlineBuilder(interaction, response, filtered);
        } else {
            await Util.reply(interaction, 'No players are online that go by this name.');
        }
    }
}

export default ServerIsonlineCommand;