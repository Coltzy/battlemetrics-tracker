import { CommandInteraction, ButtonBuilder, ButtonStyle, inlineCode } from 'discord.js';
import EmbedBuilder from '../../../utils/EmbedBuilder';
import { CsgoServerData } from '../../../types/servers';
import ServerStatsBaseBuilder from '../server-stats-base-builder';
import { Page } from '../../PageBuilder';

class CsgoServerStatsBuilder extends ServerStatsBaseBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: CsgoServerData,
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
                    value:  attributes.players + '/' + attributes.maxPlayers,
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
                    name: 'Country',
                    value: attributes.country,
                    inline: true
                },
                {
                    name: 'Map',
                    value: attributes.details.map,
                    inline: true
                },
                {
                    name: 'Password Protected',
                    value: attributes.details.password.toString(),
                    inline: true
                }
            );

        const rules = new EmbedBuilder()
            .setTitle('Server Rules');

        if (!attributes.details.rules) {
            rules.setDescription('This server dosen\'t have public rules.');
        } else {
            rules.setDescription(
                Object.entries(attributes.details.rules).map(([key, value]) => {
                    return `${inlineCode(key)}: ${value}`;
                }).join('\n').substring(0, 4096)
            );
        }

        const pages = [
            {
                embed: stats,
                button: new ButtonBuilder()
                    .setLabel('Stats')
                    .setCustomId('01')
                    .setStyle(ButtonStyle.Primary)
            },
            {
                embed: rules,
                button: new ButtonBuilder()
                    .setLabel('Rules')
                    .setCustomId('02')
                    .setStyle(ButtonStyle.Primary)
            }
        ] as Page[];

        super(interaction, pages, server);
    }
}

export default CsgoServerStatsBuilder;