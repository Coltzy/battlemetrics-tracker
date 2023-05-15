import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import iso3311a2 from 'iso-3166-1-alpha-2';
import ServerListBuilder from '../../builders/server/builder-server-list';

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

        const options = {} as { [key: string]: string };

        if (server) options['filter[search]'] = server;
        if (game) options['filter[game]'] = game;
        if (country) options['filter[countries]'] = country.toUpperCase();

        const response = await interaction.client.BMF.fetch('servers', options);

        if (!response || !response.data?.length) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        new ServerListBuilder(interaction, response.data);
    }
}

export default ServerListCommand;