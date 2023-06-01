import { CommandInteraction } from 'discord.js';
import PlayerAutocompleteCommand from './autocomplete/PlayerCommandAutocomplete';
import { PlayerWithServerMeta } from '../../types/players';
import PlayerStatsBuilder from '../../builders/player/builder-player-stats';

class PlayerStatsCommand extends PlayerAutocompleteCommand {
    public name = 'player-stats';

    public constructor() {
        super();
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
        }

        new PlayerStatsBuilder(interaction, res as PlayerWithServerMeta);
    }
}

export default PlayerStatsCommand;