import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import Autocomplete from '../../autocompletes/idocument-autocomplete';
import PlayerSessionBuilder from '../../builders/player/player-session-builder';
import PaginationBuilder from '../../builders/PaginationBuilder';

const ServerAutocomplete = new Autocomplete('servers', 'server');

class PlayerSessionCommand extends Autocomplete {
    public name = 'player-session';

    public constructor() {
        super('players', 'query', (interaction: AutocompleteInteraction) => ServerAutocomplete.autocomplete(interaction));
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const name = interaction.options.get('server')?.value as string | undefined; 
        const response = await interaction.client.BMF.get('players', query);

        if (!response) {
            return await interaction.respond('No search results were found for the query.');
        }

        const options = {
            'include': 'server',
            'page[size]': '100'
        } as { [key: string]: string };

        if (name) {
            const server = await interaction.client.BMF.get('servers', name);
            
            if (!server) {
                return await interaction.respond('No search results were found for the server.');
            }

            options['filter[servers]'] = server.data.id;
        }

        const res = await interaction.client.BMF.fetch(`players/${response.data.id}/relationships/sessions`, options);

        if (!res) {
            return await interaction.respond('There seems to have been an issue executing this command.');
        } else if (!res.data.length) {
            return await interaction.respond('This player has no previous sessions.');
        }

        const builder = new PlayerSessionBuilder(response);
        const slides = builder.build(res);

        new PaginationBuilder(interaction, slides, res.links, builder);
    }
}

export default PlayerSessionCommand;