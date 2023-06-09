import { CommandInteraction } from 'discord.js';
import Autocomplete from '../../autocompletes/idocument-autocomplete';
import { PlayerSearch } from '../../types/players';
import PlayerListBuilder from '../../builders/player/player-list-builder';
import FilterBuilder, { FilterButton } from '../../builders/FilterBuilder';

class PlayerListCommand extends Autocomplete {
    public name = 'player-list';

    public constructor() {
        super('servers', 'server');
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string | undefined;
        const server = interaction.options.get('server')?.value as string | undefined;
        const online = interaction.options.get('online')?.value || false as boolean;

        const options = {
            'filter[online]': online,
            'page[size]': '100'
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
        const slides = builder.build(response as PlayerSearch);
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
        
        new FilterBuilder(interaction, slides, uri, response.links, builder, filters);
    }
}

export default PlayerListCommand;