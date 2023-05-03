import { EmbedBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { MinecraftServerData } from '../../types/servers';
import PageBuilder from '../PageBuilder';

class MinecraftServerStatsBuilder extends PageBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: MinecraftServerData,
    ) {
        const { attributes } = server;

        const stats = new EmbedBuilder()
            .setTitle(attributes.name)
            .setDescription(attributes.details.minecraft_clean_description)
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
                    name: 'Version',
                    value: `${attributes.details.minecraft_version_name} (Protocol ${attributes.details.minecraft_version.protocol})`,
                    inline: true
                },
                {
                    name: 'Modded',
                    value: attributes.details.minecraft_modded.toString(),
                    inline: true
                }
            )
        .setFooter({ text: attributes.name });

        const mods = new EmbedBuilder()
            .setTitle('Server Mods')
            .setFooter({ text: attributes.name });

        if (!attributes.details.minecraft_mods?.length) {
            mods.setDescription('This is not a modded server.');
        } else {
            mods.setDescription(attributes.details.minecraft_mods.join('\n'));
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

export default MinecraftServerStatsBuilder;