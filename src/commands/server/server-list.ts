import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import ServerListBuilder from '../../builders/server/builder-server-list';

class ServerListCommand implements Command {
    public name = 'server-list';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.search('servers', query);

        if (!response || !response.length) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        new ServerListBuilder(interaction, response);
    }
}

export default ServerListCommand;