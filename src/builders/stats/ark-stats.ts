import { EmbedBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ArkServerData } from '../../types/servers';
import PageBuilder from '../PageBuilder';

class ArkServerStatsBuilder extends PageBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: ArkServerData,
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
                    name: 'In-game Day',
                    value: attributes.details.time,
                    inline: true
                },
                { 
                    name: 'Server Type', 
                    value: attributes.details.offical ? 'Offical' : 'Unoffical', 
                    inline: true
                },
                {
                    name: 'PVE',
                    value: attributes.details.pve.toString(),
                    inline: true
                }
            )
        .setFooter({ text: attributes.name });

        const mods = new EmbedBuilder()
            .setTitle('Server Mods')
            .setFooter({ text: attributes.name });

        if (!attributes.details.modIds.length) {
            mods.setDescription('This server dosen\'t have any mods.');
        } else {
            const path = 'https://steamcommunity.com/sharedfiles/filedetails/?id=';
            mods.setDescription(
                attributes.details.modIds.map((id, index) => {
                    return `[${attributes.details.modNames[index]}](${path + id})`;
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

        const pages = [
            {
                embed: stats,
                button: new ButtonBuilder()
                    .setLabel('📈 Stats')
                    .setCustomId('01')
                    .setStyle(ButtonStyle.Primary)
            },
            {
                embed: mods,
                button: new ButtonBuilder()
                    .setLabel('🛡️ Mods')
                    .setCustomId('02')
                    .setStyle(ButtonStyle.Primary)
            }
        ];

        super(interaction, pages, {
            links
        });
    }
}

export default ArkServerStatsBuilder;