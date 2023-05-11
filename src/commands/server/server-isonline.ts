import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { Server } from '../../types/servers';
import ServerIsonlineBuilder from '../../builders/server/builder-server-isonline';

class ServerIsonlineCommand implements Command {
    public name = 'server-isonline';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const server = interaction.options.get('server')?.value as string;
        const player = interaction.options.get('player')?.value as string;
        const response = await interaction.client.BMF.get('servers', server);

        if (!response) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        const res = await interaction.client.BMF.fetch(`servers/${response.data.id}`, {
            'include': 'player'
        }) as Server;

        if ('errors' in res) {
            return await interaction.respond('There was an error when fetching the player data.');
        }

        const filtered = res.included?.filter((p) => p.attributes.name.toLowerCase() == player.toLowerCase());

        if (!filtered?.length) {
            return await interaction.respond('No players are online that go by this name.');
        }
        
        new ServerIsonlineBuilder(interaction, response, filtered);
    }
}

export default ServerIsonlineCommand;