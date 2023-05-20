import { EmbedBuilder, CommandInteraction, ButtonBuilder, ButtonStyle, hyperlink } from 'discord.js';
import { DayzServerData } from '../../../types/servers';
import ServerStatsBaseBuilder from '../builder-server-stats-base';
import { Page } from '../../PageBuilder';

class DayzServerStatsBuilder extends ServerStatsBaseBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: DayzServerData,
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
                    name: 'Time',
                    value: attributes.details.time,
                    inline: true
                },
                {
                    name: 'Password Protected',
                    value: attributes.details.password.toString(),
                    inline: true
                },
                {
                    name: 'Official Server',
                    value: attributes.details.official.toString(),
                    inline: true
                },
                {
                    name: 'Version',
                    value: attributes.details.version,
                    inline: true
                },
                {
                    name: 'Third Person',
                    value: attributes.details.third_person.toString(),
                    inline: true
                }
            );

        const mods = new EmbedBuilder()
            .setTitle('Mods');

        if (attributes.details.modIds.length) {
            const path = 'https://steamcommunity.com/sharedfiles/filedetails/?id=';
            mods.setDescription(
                Object.entries(attributes.details.modIds).map((id, index) => {
                    return hyperlink(attributes.details.modNames[index], path + id);
                }).join('\n')
            );
        } else {
            mods.setDescription('This server dosen\'t have mods.');
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
                embed: mods,
                button: new ButtonBuilder()
                    .setLabel('Mods')
                    .setCustomId('02')
                    .setStyle(ButtonStyle.Primary)
            }
        ] as Page[];

        super(interaction, pages, server);
    }
}

export default DayzServerStatsBuilder;