import { CommandInteraction, inlineCode } from 'discord.js';
import Command from '../../Command';
import ServerListBuilder from '../../builders/server/builder-server-list';
import Util from '../../Util';

class ServerListCommand implements Command {
    public name = 'server-list';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.searchServers(query);

        if (!response) {
            await Util.reply(interaction, `No search results were found for ${inlineCode(query)}`);

            return;
        }

        new ServerListBuilder(interaction, response);
    }
}

export default ServerListCommand;