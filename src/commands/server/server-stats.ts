import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { inlineCode } from '@discordjs/builders';
import Logger from '../../Logger';
import { Server, RustServer } from '../../types/servers';
import { BMErrors } from '../../types/BMError';
import RustServerStatsBuilder from '../../builders/rust/rust-stats';
import 'moment-duration-format';

class ServerStatsCommand implements Command {
    public name = 'server-stats';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const id = interaction.options.get('id')?.value as string;
        let data: BMErrors | Server;

        try {
            data = await interaction.client.BMF.fetch('servers/{ID}', id);
        } catch (err) {
            Logger.error('There was an error when fetching from battlemetrics.');
            console.error(err);

            interaction.reply('There was an unexpected error when fetching this data.');
            return;
        }

        if ('errors' in data) {
            const status = data.errors[0].status;

            if (status == 'Unknown Server') {
                interaction.reply(`Server ID ${inlineCode(id)} doesn't exist.`);
            } else if (status) {
                interaction.reply('There was an error fetching battlemetrics data.');
            }

            return;
        }

        const { data: server } = (data as unknown as RustServer);

        if (server.relationships.game.data.id == 'rust') {
            new RustServerStatsBuilder(interaction, server);
        } else {
            interaction.reply('This server type is currently not yet supported!');
        }
    }
}

export default ServerStatsCommand;