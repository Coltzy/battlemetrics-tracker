import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { PlayerWithServerMeta } from '../../types/players';
import PlayerServersBuilder from '../../builders/player/builder-player-servers';

class PlayerServersCommand implements Command {
    public name = 'player-servers';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

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