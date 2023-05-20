import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import iso3311a2 from 'iso-3166-1-alpha-2';
import { BaseServerData } from '../../types/servers';
import ServerListBuilder from '../../builders/server/builder-server-list';
import FilterBuilder, { FilterButton } from '../../builders/FilterBuilder';

class ServerListCommand implements Command {
    public name = 'server-list';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const server = interaction.options.get('query')?.value as string | undefined;
        const game = interaction.options.get('game')?.value as string | undefined;
        const country = interaction.options.get('country')?.value as string | undefined;

        if (country && !iso3311a2.getCountry(country.toUpperCase())) {
            return await interaction.respond('This is an invalid ISO country code.');
        }

        const options = {
            'page[size]': '100',
            'sort': 'rank'
        } as { [key: string]: string };

        if (server) options['filter[search]'] = server;
        if (game) options['filter[game]'] = game;
        if (country) options['filter[countries]'] = country.toUpperCase();

        const response = await interaction.client.BMF.fetch('servers', options);

        if (!response || !response.data?.length) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        const builder = new ServerListBuilder();
        const pages = builder.build(response.data as BaseServerData[]);
        const uri = interaction.client.BMF.uri('servers', options);

        const filters = [
            { 
                name: 'Rank', 
                value: 'rank', 
                description: (negative) => `Sorting by rank. Highest ranking ${negative ? 'first' : 'last'}.` 
            },
            { 
                name: 'Name', 
                value: 'name', 
                description: (negative) => `Sorting by name. Alphabetically ranking ${negative ? 'first' : 'last'}.` 
            },
            { 
                name: 'Players', 
                value: 'players', 
                description: (negative) => `Sorting by player count. ${negative ? 'Highest' : 'Lowest'} ranking first.` 
            }
        ] as FilterButton[];

        new FilterBuilder(interaction, pages, uri, builder, filters);
    }
}

export default ServerListCommand;