import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import PlayerSessionBuilder from '../../builders/player/builder-player-session';
import { PlayerSessionDataWithServers } from '../../types/players';

class PlayerSessionCommand implements Command {
    public name = 'player-session';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const player = interaction.options.get('player')?.value as string;
        const name = interaction.options.get('server')?.value as string | undefined; 
        const response = await interaction.client.BMF.get('players', player);

        if (!response) {
            return await interaction.respond('No search results were found for the query.');
        }

        const options = {
            'include': 'server'
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

        new PlayerSessionBuilder(interaction, response, res as PlayerSessionDataWithServers);
    }
}

export default PlayerSessionCommand;