import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import PlayerListBuilder from '../../builders/player/builder-player-list';

class PlayerListCommand implements Command {
    public name = 'player-list';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const player = interaction.options.get('player')?.value as string | undefined;
        const server = interaction.options.get('server')?.value as string | undefined;
        const limit = interaction.options.get('limit')?.value || 10 as number;
        const online = interaction.options.get('online')?.value || false as boolean;

        const options = {
            'filter[online]': online,
            'page[size]': limit
        } as { [key: string]: string };

        if (player) {
            options['filter[search]'] = player;
        }

        if (server) {
            const s = await interaction.client.BMF.get('servers', server);

            if (s) {
                options['filter[servers]'] = s.data.attributes.id;
            }
        }

        const response = await interaction.client.BMF.fetch('players', options);

        if (!response || !response.data?.length) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        new PlayerListBuilder(interaction, response.data);
    }
}

export default PlayerListCommand;