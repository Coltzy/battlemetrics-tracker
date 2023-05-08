import { CommandInteraction, inlineCode } from 'discord.js';
import Command from '../../Command';
import Util from '../../Util';
import { Server } from '../../types/servers';
import ServerPlayersBuilder from '../../builders/server/builder-server-players';

class ServerPlayersCommand implements Command {
    public name = 'server-players';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('servers', query);

        if (!response) {
            await Util.reply(interaction, `No search results were found for ${inlineCode(query)}`);

            return;
        } 
        
        const { id } = response.data.relationships.game.data;
        if (!Util.serverHasPlayerList(id)) {
            await Util.reply(interaction, `The server type ${inlineCode(id)} does not support player lists.`);

            return;
        }

        const res = await interaction.client.BMF.fetch(`servers/${response.data.id}`, {
            'include': 'player'
        }) as Server;

        if (res.included && !res.included.length) {
            await Util.reply(interaction, `They are no online players on the server ${inlineCode(response.data.attributes.name)}`);

            return;
        }

        new ServerPlayersBuilder(interaction, res);
    }
}

export default ServerPlayersCommand;