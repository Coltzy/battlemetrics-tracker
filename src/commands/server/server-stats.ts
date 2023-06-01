import { CommandInteraction } from 'discord.js';
import ServerAutocompleteCommand from './autocomplete/ServerCommandAutocomplete';
import { Server, RustServerData, ArkServerData, CsgoServerData, MinecraftServerData, GmodServerData, DayzServerData, CsServerData } from '../../types/servers';

import RustServerStatsBuilder from '../../builders/server/stats/builder-rust-stats';
import ArkServerStatsBuilder from '../../builders/server/stats/builder-ark-stats';
import CsgoServerStatsBuilder from '../../builders/server/stats/builder-csgo-stats';
import MinecraftServerStatsBuilder from '../../builders/server/stats/builder-minecraft-stats';
import GmodServerStatsBuilder from '../../builders/server/stats/builder-gmod-stats';
import DayzServerStatsBuilder from '../../builders/server/stats/builder-dayz-stats';

type AllServerData = RustServerData & ArkServerData & CsgoServerData & MinecraftServerData & GmodServerData & DayzServerData & CsServerData;

const Builders = {
    'rust': RustServerStatsBuilder,
    'ark': ArkServerStatsBuilder,
    'csgo': CsgoServerStatsBuilder,
    'minecraft': MinecraftServerStatsBuilder,
    'gmod': GmodServerStatsBuilder,
    'dayz': DayzServerStatsBuilder,
    'cs': CsgoServerStatsBuilder
};

class ServerStatsCommand extends ServerAutocompleteCommand {
    public name = 'server-stats';

    public constructor() {
        super();
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('servers', query);

        if (!response) {
            return await interaction.respond(`No search results were found for the query.`);
        }

        const { data: server } = response as Server;
        const builder = Builders[server.relationships.game.data.id as keyof typeof Builders];
        
        if (!builder) {
            return await interaction.respond(`Server's from ${server.relationships.game.data.id} are currently not supported!`);
        }

        new builder(interaction, server as AllServerData);
    }
}

export default ServerStatsCommand;