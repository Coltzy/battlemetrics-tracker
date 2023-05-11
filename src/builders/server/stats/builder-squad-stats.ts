import { EmbedBuilder, CommandInteraction } from 'discord.js';
import { SquadServerData } from '../../../types/servers';
import ServerStatsBaseBuilder from '../builder-server-stats-base';

class SquadServerStatsBuilder extends ServerStatsBaseBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: SquadServerData,
    ) {
        const { attributes } = server;

        const stats = new EmbedBuilder()
            .setTitle(attributes.name)
            .addFields(
                {
                    name: 'Rank', 
                    value: '#' + attributes.rank.toString(), 
                    inline: true 
                },
                { 
                    name: 'Player count', 
                    value:  attributes.players + '/' + attributes.maxPlayers
                        + (attributes.details.numPrivConn > 0 
                            ? '(' + attributes.details.numPrivConn + ')' : ''),
                    inline: true
                },
                {
                    name: 'Address',
                    value: attributes.ip.toString(),
                    inline: true
                },
                {
                    name: 'Status',
                    value: attributes.status,
                    inline: true
                },
                {
                    name: 'Map',
                    value: attributes.details.map,
                    inline: true,
                },
                {
                    name: 'Game Mode',
                    value: attributes.details.gameMode,
                    inline: true
                },
                {
                    name: 'Licensed Server',
                    value: attributes.details.licensedServer ? 'True, Licensed' : 'False, Unlicensed',
                    inline: true
                }
            );

        super(interaction, stats, server);
    }
}

export default SquadServerStatsBuilder;