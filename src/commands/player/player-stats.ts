import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import Logger from '../../Logger';
import Util from '../../Util';
import { Player } from '../../types/players';
import { BMErrors } from '../../types/BMError';
import PlayerStatsBuilder from '../../builders/player/builder-player-stats';

class PlayerStatsCommand implements Command {
    public name = 'player-stats';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        let response: Player | BMErrors | undefined;
        
        try {
            response = await interaction.client.BMF.fetch(`players/${query}`, {
                'include': 'server'
            });
        } catch (err) {
            Logger.error('There was an error when fetching from battlemetrics.');
            console.error(err);

            await Util.reply(interaction, 'There was an error when fetching this data.');
            return;
        }

        if (response && 'errors' in response) {
            if (response.errors[0].status == '400') {
                await Util.reply(interaction, 'Invalid player ID provided.');
            } else {
                await Util.reply(interaction, 'There was an error when fetching from battlemetrics.');
            }

            return;
        }

        if (!response) return;

        new PlayerStatsBuilder(interaction, response);
    }
}

export default PlayerStatsCommand;