import { EmbedBuilder, CommandInteraction, ButtonBuilder, ButtonStyle, inlineCode } from 'discord.js';
import { GmodServerData } from '../../../types/servers';
import ServerStatsBaseBuilder from '../builder-server-stats-base';

class GmodServerStatsBuilder extends ServerStatsBaseBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: GmodServerData,
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
                Object.entries(attributes.details.rules)
                    .map(([key, value]) => inlineCode(key) + ': ' + value).join('\n')
            );
        }

        const pages = [
            {
                embed: stats,
                button: new ButtonBuilder()
                    .setLabel('📈 Stats')
                    .setCustomId('01')
                    .setStyle(ButtonStyle.Primary)
            },
            {
                embed: rules,
                button: new ButtonBuilder()
                    .setLabel('📜 Rules')
                    .setCustomId('02')
                    .setStyle(ButtonStyle.Primary)
            }
        ];

        super(interaction, pages, server);
    }
}

export default GmodServerStatsBuilder;