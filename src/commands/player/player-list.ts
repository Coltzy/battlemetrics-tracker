import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { PlayerData } from '../../types/players';
import PlayerListBuilder from '../../builders/player/builder-player-list';
import FilterBuilder, { FilterButton } from '../../builders/FilterBuilder';

class PlayerListCommand implements Command {
    public name = 'player-list';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string | undefined;
        const server = interaction.options.get('server')?.value as string | undefined;
        const limit = interaction.options.get('limit')?.value || 10 as number;
        const online = interaction.options.get('online')?.value || false as boolean;

        const options = {
            'filter[online]': online,
            'page[size]': limit
        } as { [key: string]: string };

        if (query) options['filter[search]'] = query;

        if (server) {
            const s = await interaction.client.BMF.get('servers', server);

            if (s) {
                options['filter[servers]'] = s.data.attributes.id;
            }
        }

        if (!query) options['sort'] = '-lastSeen';

        const response = await interaction.client.BMF.fetch('players', options);

        if (!response || !response.data?.length) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        const builder = new PlayerListBuilder();
        const pages = builder.build(response.data as PlayerData[]);
        const uri = interaction.client.BMF.uri('players', options);

        const filters = [
            { 
                name: 'Last seen', 
                value: 'lastSeen', 
                description: (negative) => `Sorting by last seen. Most recent ${negative ? 'first' : 'last'}.` 
            },
            { 
                name: 'First seen', 
                value: 'firstSeen', 
                description: (negative) => `Sorting by first seen. ${negative ? 'Oldest' : 'Newest'} players first.` 
            },
        ] as FilterButton[];

        if (query) {
            filters.push({ 
                name: 'Relevance', 
                value: 'relevance', 
                remove: true, 
                description: 'Sorting by relevance.' 
            });
        }
        
        new FilterBuilder(interaction, pages, uri, builder, filters);
    }
}

export default PlayerListCommand;