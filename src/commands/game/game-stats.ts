import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { inlineCode } from '@discordjs/builders';
import Logger from '../../Logger';
import { Game } from '../../types/game';
import GameStatsBuilder from '../../builders/game/builder-game-stats';
import { BMErrors } from '../../types/BMError';

class GameStatsCommand implements Command {
    public name = 'game-stats';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const id = interaction.options.get('id')?.value as string;
        let data: BMErrors | Game;

        try {
            data = await interaction.client.BMF.fetch(`games/${id}`);
        } catch (err) {
            Logger.error('There was an error when fetching from battlemetrics.');
            console.error(err);

            return await interaction.respond('There was an unexpected error when fetching this data.');
        }

        if ('errors' in data) {
            const error = data.errors[0];

            if (error.title == 'Unknown Game') {
                await interaction.respond(`Game ID ${inlineCode(id)} doesn't exist.`);
            } else {
                await interaction.respond('There was an error fetching battlemetrics data.');
            }

            return;
        }

        new GameStatsBuilder(interaction, data);
    }
}

export default GameStatsCommand;