import { CommandInteraction, inlineCode } from 'discord.js';
import Autocomplete from '../../autocompletes/idocument-autocomplete';
import Util from '../../Util';
import { ServerWithPlayerList } from '../../types/servers';
import ServerPlayersBuilder from '../../builders/server/server-players-builder';

class ServerPlayersCommand extends Autocomplete {
    public name = 'server-players';

    public constructor() {
        super('servers', 'query');
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('servers', query);

        if (!response) {
            await interaction.respond(`No search results were found for the query.`);

            return;
        } 
        
        const { id } = response.data.relationships.game.data;
        if (!Util.serverHasPlayerList(id)) {
            return await interaction.respond(`The server type ${inlineCode(id)} does not support player lists.`);
        }

        const res = await interaction.client.BMF.fetch(`servers/${response.data.id}`, {
            'include': 'player'
        });

        if (res.included && !res.included.length) {
            return await interaction.respond(`They are no online players on the server ${inlineCode(response.data.attributes.name)}`);
        }

        new ServerPlayersBuilder(interaction, res as ServerWithPlayerList);
    }
}

export default ServerPlayersCommand;