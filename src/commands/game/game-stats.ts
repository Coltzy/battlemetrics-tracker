import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { inlineCode } from '@discordjs/builders';
import Logger from '../../Logger';
import { Game } from '../../types/game';
import GameStatsBuilder from '../../builders/game/GameBase';
import { BMErrors } from '../../types/BMError';
import 'moment-duration-format';

class GameStatsCommand implements Command {
    public name = 'game-stats';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const id = interaction.options.get('id')?.value as string;
        let data: BMErrors | Game;

        try {
            data = await interaction.client.BMF.fetch('games', id);
        } catch (err) {
            Logger.error('There was an error when fetching from battlemetrics.');
            console.error(err);

            interaction.reply('There was an unexpected error when fetching this data.');
            return;
        }

        if ('errors' in data) {
            console.log(data);
            const error = data.errors[0];

            if (error.title == 'Unknown Game') {
                interaction.reply(`Game ID ${inlineCode(id)} doesn't exist.`);
            } else {
                interaction.reply('There was an error fetching battlemetrics data.');
            }

            return;
        }

        const { data: game } = (data as unknown as Game);
        new GameStatsBuilder(interaction, game);
    }
}

export default GameStatsCommand;