import { CommandInteraction, inlineCode } from 'discord.js';
import PlayerModel from '../../models/PlayerModel';
import PlayerAutocompleteCommand from './autocomplete/PlayerCommandAutocomplete';

class PlayerUnfavoriteCommand extends PlayerAutocompleteCommand {
    public name = 'player-unfavorite';

    public constructor() {
        super();
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;

        const doc = interaction.client.players.get(interaction.user.id)?.find((doc) => doc.id == query);
        
        if (!doc) {
            return await interaction.respond('This player is not included in your favorite list.');
        }
        
        const { user } = interaction;
        PlayerModel.deleteOne({ user: user.id, id: query });

        interaction.client.players.delete(user.id, doc);

        await interaction.respond(`Player ${inlineCode(doc.name)} has been removed from your favorite list.`);
    }
}

export default PlayerUnfavoriteCommand;