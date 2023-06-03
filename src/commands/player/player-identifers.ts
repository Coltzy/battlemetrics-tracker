import { CommandInteraction } from 'discord.js';
import PlayerAutocompleteCommand from './autocomplete/PlayerCommandAutocomplete';
import { PlayerWithIdentifers } from '../../types/players';
import PlayerIdentifiersBuilder from '../../builders/player/player-identifiers-builder';

class PlayerIdentifiersCommand extends PlayerAutocompleteCommand {
    public name = 'player-identifiers';

    public constructor() {
        super();
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('players', query);

        if (!response) {
            await interaction.respond(`No search results were found for the query.`);

            return;
        }

        const res = await interaction.client.BMF.fetch(`players/${response.data.id}`, {
            'include': 'identifier'
        });

        if (!res) {
            return await interaction.respond('There seems to have been an issue executing this command.');
        } else if (res.included.length <= 1) {
            return await interaction.respond('This player has no previous identifiers.');
        }

        new PlayerIdentifiersBuilder(interaction, res as PlayerWithIdentifers);
    }
}

export default PlayerIdentifiersCommand;