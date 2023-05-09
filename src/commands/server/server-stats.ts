import { CommandInteraction } from 'discord.js';
import Command from '../../Command';
import { inlineCode } from '@discordjs/builders';
import { Server, RustServerData, ArkServerData, CsgoServerData, MinecraftServerData, GmodServerData } from '../../types/servers';
import Util from '../../Util';

import RustServerStatsBuilder from '../../builders/server/stats/builder-rust-stats';
import ArkServerStatsBuilder from '../../builders/server/stats/builder-ark-stats';
import CsgoServerStatsBuilder from '../../builders/server/stats/builder-csgo-stats';
import MinecraftServerStatsBuilder from '../../builders/server/stats/builder-minecraft-stats';
import GmodServerStatsBuilder from '../../builders/server/stats/builder-gmod-stats';

type AllServerData = RustServerData & ArkServerData & CsgoServerData & MinecraftServerData & GmodServerData;

const Builders = {
    'rust': RustServerStatsBuilder,
    'ark': ArkServerStatsBuilder,
    'csgo': CsgoServerStatsBuilder,
    'minecraft': MinecraftServerStatsBuilder,
    'gmod': GmodServerStatsBuilder
};

class ServerStatsCommand implements Command {
    public name = 'server-stats';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('servers', query);

        if (!response) {
            await Util.reply(interaction, `The search for ${inlineCode(query)} didn't find any results.`);

            return;
        }

        const { data: server } = response as Server;
        const builder = Builders[server.relationships.game.data.id as keyof typeof Builders];
        
        if (builder) {
            new builder(interaction, server as AllServerData);
        } else {
            await Util.reply(interaction, `Server's from ${server.relationships.game.data.id} are currently not supported!`);
        }
    }
}

export default ServerStatsCommand;