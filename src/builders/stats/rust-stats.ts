import { EmbedBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { RustServerData } from '../../types/servers';
import moment from 'moment';
import PageBuilder, { CommandButton } from '../PageBuilder';
import ServerLeaderboardCommand from '../../commands/server/server-leaderboard';
import Command from '../../Command';

class RustServerStatsBuilder extends PageBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: RustServerData,
    ) {
        const { attributes } = server;

        const stats = new EmbedBuilder()
            .setTitle(attributes.name)
            .setDescription(attributes.details.rust_description.substring(0, 4096))
            .addFields(
                {
                    name: 'Rank', 
                    value: '#' + attributes.rank.toString(), 
                    inline: true 
                },
                { 
                    name: 'Player count', 
                    value:  attributes.players + '/' + attributes.maxPlayers
                        + (attributes.details.rust_queued_players > 0 
                            ? '(' + attributes.details.rust_queued_players + ')' : ''),
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
                    name: 'Last wipe',
                    value: moment(attributes.details.rust_last_wipe).format('L'),
                    inline: true,
                },
                {
                    name: 'Country',
                    value: attributes.country,
                    inline: true
                },
                {
                    name: 'Uptime',
                    value: moment(attributes.details.rust_uptime).format('D [days], H [hrs], m [mins]'),
                    inline: true
                },
                {
                    name: 'Average FPS',
                    value: attributes.details.rust_fps_avg.toString(),
                    inline: true
                },
                {
                    name: 'Entity count',
                    value: attributes.details.rust_ent_cnt_i.toString(),
                    inline: true
                },
                { 
                    name: 'Map Seed', 
                    value: attributes.details.rust_world_seed.toString(), 
                    inline: true
                },
                {
                    name: 'Map Size',
                    value: attributes.details.rust_world_size.toString(),
                    inline: true
                },
                {
                    name: 'Map Type',
                    value: attributes.details.map,
                    inline: true
                }
            )
        .setImage(attributes.details.rust_headerimage)
        .setFooter({ text: attributes.name });

        const map = new EmbedBuilder()
            .setFooter({ text: attributes.name });

        if (attributes.details.rust_maps) {
            map.setImage(attributes.details.rust_maps.thumbnailUrl);
        } else {
            map.setDescription('Map image preview is unavailable.');
        }

        const links = new ActionRowBuilder<ButtonBuilder>();
        if (attributes.details.rust_maps) {
            links.addComponents(
                new ButtonBuilder()
                    .setLabel('Rust Maps')
                    .setStyle(ButtonStyle.Link)
                    .setURL(attributes.details.rust_maps.url)
            );
        }

        if (attributes.details.rust_url) {
            links.addComponents(
                new ButtonBuilder()
                    .setLabel('Website')
                    .setStyle(ButtonStyle.Link)
                    .setURL(attributes.details.rust_url)
            );
        }

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
                    .setCustomId('stats')
                    .setStyle(ButtonStyle.Primary)
            },
            {
                embed: map,
                button: new ButtonBuilder()
                    .setLabel('🗺️ Map')
                    .setCustomId('map')
                    .setStyle(ButtonStyle.Primary)
            }
        ];

        super(interaction, pages, {
            links,
            cbs
        });
    }
}

export default RustServerStatsBuilder;