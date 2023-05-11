import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import PlayerListBuilder from '../../builders/player/builder-player-list';

class PlayerListCommand implements Command {
    public name = 'player-list';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.search('players', query);

        if (!response || !response.length) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        new PlayerListBuilder(interaction, response);
    }
}

export default PlayerListCommand;