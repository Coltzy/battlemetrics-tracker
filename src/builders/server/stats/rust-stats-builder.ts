import { CommandInteraction, ButtonBuilder, ButtonStyle, hyperlink, TimestampStyles, time } from 'discord.js';
import EmbedBuilder from '../../../utils/EmbedBuilder';
import { RustServerData } from '../../../types/servers';
import moment from 'moment';
import ServerStatsBaseBuilder from '../server-stats-base-builder';
import { Page } from '../../PageBuilder';

class RustServerStatsBuilder extends ServerStatsBaseBuilder {
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
                    value: time(moment(attributes.details.rust_last_wipe).unix(), TimestampStyles.ShortDate),
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
                    value: attributes.details.rust_ent_cnt_i.toLocaleString(),
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
        .setImage(attributes.details.rust_headerimage);

        // const url = attributes.details.rust_url;
        // if (url) {
        //     stats.setURL(url);
        // }

        const map = new EmbedBuilder()
            .setTitle('Map');

        if (attributes.details.rust_maps) {
            map.setImage(attributes.details.rust_maps.thumbnailUrl)
                .setDescription(hyperlink('Click here to view map.', attributes.details.rust_maps.url));
        } else {
            map.setDescription('Map image preview is unavailable.');
        }

        const pages = [
            {
                embed: stats,
                button: new ButtonBuilder()
                    .setLabel('Information')
                    .setCustomId('information')
                    .setStyle(ButtonStyle.Primary)
            },
            {
                embed: map,
                button: new ButtonBuilder()
                    .setLabel('Map')
                    .setCustomId('map')
                    .setStyle(ButtonStyle.Primary)
            }
        ] as Page[];

        super(interaction, pages, server);
    }
}

export default RustServerStatsBuilder;