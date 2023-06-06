import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import Autocomplete from '../../autocompletes/idocument-autocomplete';
import ms from 'ms';
import { PlayerCoplayData } from '../../types/players';
import PlayerCoplayBuilder from '../../builders/player/player-coplay-builder';

const ServerAutocomplete = new Autocomplete('servers', 'server');

class PlayerCoplayCommand extends Autocomplete {
    public name = 'player-coplay';

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
            'filter[period]': new Date(Date.now() - ms('1d')).toISOString() + ":" + new Date(Date.now()).toISOString(),
        } as { [key: string]: string };

        let server;
        if (name) {
            server = await interaction.client.BMF.get('servers', name);
            
            if (!server) {
                return await interaction.respond('No search results were found for the server.');
            }

            options['filter[servers]'] = server.data.id;
        }

        const res = await interaction.client.BMF.fetch(`players/${response.data.id}/relationships/coplay`, options);

        if (!res) {
            return await interaction.respond('There seems to have been an issue executing this command.');
        } else if (!res.data.length) {
            return await interaction.respond('This player has no previous coplay experiences.');
        }

        new PlayerCoplayBuilder(interaction, response, res as PlayerCoplayData, server?.data);
    }
}

export default PlayerCoplayCommand;