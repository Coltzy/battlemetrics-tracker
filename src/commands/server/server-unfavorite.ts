import { CommandInteraction, inlineCode } from 'discord.js';
import Autocomplete from '../../autocompletes/idocument-autocomplete';
import ServerModel from '../../models/ServerModel';

class ServerUnfavoriteCommand extends Autocomplete {
    public name = 'server-unfavorite';

    public constructor() {
        super('servers', 'query');
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;

        const doc = interaction.client.servers.get(interaction.user.id)?.find((doc) => doc.id == query);
        
        if (!doc) {
            return await interaction.respond('This server is not included in your favorite list.');
        }
        
        const { user } = interaction;
        await ServerModel.deleteOne({ user: user.id, id: query });

        interaction.client.servers.delete(user.id, doc);

        await interaction.respond(`Server ${inlineCode(doc.name)} has been removed from your favorite list.`);
    }
}

export default ServerUnfavoriteCommand;