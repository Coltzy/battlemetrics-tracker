import { EmbedBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, inlineCode } from 'discord.js';
import { CsgoServerData } from '../../types/servers';
import PageBuilder from '../PageBuilder';
import Command from '../../Command';
import ServerLeaderboardCommand from '../../commands/server/server-leaderboard';

class CsgoServerStatsBuilder extends PageBuilder {
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
            )
        .setFooter({ text: attributes.name });

        const rules = new EmbedBuilder()
            .setTitle('Server Rules')
            .setFooter({ text: attributes.name });

        if (!attributes.details.rules) {
            rules.setDescription('This server dosen\'t have public rules.');
        } else {
            rules.setDescription(
                Object.entries(attributes.details.rules).map(([key, value]) => {
                    return `${inlineCode(key)}: ${value}`;
                }).join('\n')
            );
        }

        const links = new ActionRowBuilder<ButtonBuilder>();

        links.addComponents(
            new ButtonBuilder()
                .setLabel('Raw')
                .setStyle(ButtonStyle.Link)
                .setURL(interaction.client.BMF.uri(`servers/${server.id}`))
        );

        const cbs = [
            {
                command: new ServerLeaderboardCommand() as unknown as Command,
                button: new ButtonBuilder()
                    .setLabel('🏆 Leaderboard')
                    .setCustomId('leaderboard')
                    .setStyle(ButtonStyle.Primary)
            }
        ];

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

        super(interaction, pages, {
            links,
            cbs
        });
    }
}

export default CsgoServerStatsBuilder;