import { CommandInteraction } from 'discord.js';
import Autocomplete from '../../autocompletes/idocument-autocomplete';
import { PlayerWithServerMeta } from '../../types/players';
import PlayerServersBuilder from '../../builders/player/player-servers-builder';

class PlayerServersCommand extends Autocomplete {
    public name = 'player-servers';

    public constructor() {
        super('players', 'query');
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('players', query);

        if (!response) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        const res = await interaction.client.BMF.fetch(`players/${response.data.id}`, {
            'include': 'server'
        });

        if (!res) {
            return await interaction.respond('There seems to have been an issue executing this command.');
        } else if (!res.included.length) {
            return await interaction.respond('This player has no previous servers.');
        }

        new PlayerServersBuilder(interaction, res as PlayerWithServerMeta);
    }
}

export default PlayerServersCommand;