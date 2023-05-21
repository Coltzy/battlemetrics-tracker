import { CommandInteraction, ButtonBuilder, ButtonStyle } from 'discord.js';
import EmbedBuilder from '../../../utils/EmbedBuilder';
import { ArkServerData } from '../../../types/servers';
import ServerStatsBaseBuilder from '../builder-server-stats-base';
import { Page } from '../../PageBuilder';

class ArkServerStatsBuilder extends ServerStatsBaseBuilder {
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
            );

        const mods = new EmbedBuilder()
            .setTitle('Server Mods');

        if (attributes.details.modIds.length) {
            const path = 'https://steamcommunity.com/sharedfiles/filedetails/?id=';
            
            mods.setDescription(
                attributes.details.modIds.map((id, index) => {
                    return `[${attributes.details.modNames[index]}](${path + id})`;
                }).join('\n')
            );
        } else {
            mods.setDescription('This server dosen\'t have any mods.');
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

export default ArkServerStatsBuilder;