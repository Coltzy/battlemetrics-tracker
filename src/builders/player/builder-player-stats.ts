import { EmbedBuilder, CommandInteraction, inlineCode, hyperlink, ButtonStyle } from 'discord.js';
import BuilderBase from '../BuilderBase';
import { PlayerWithServerMeta } from '../../types/players';
import moment from 'moment';
import Util from '../../Util';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import Command from '../../Command';
import PlayerServersCommand from '../../commands/player/player-servers';
import 'moment-duration-format';

class PlayerStatsBuilder extends BuilderBase {
    constructor(
        interaction: CommandInteraction,
        player: PlayerWithServerMeta,
    ) {
        const { attributes } = player.data;
        const { included: servers } = player;

        console.log(player.data);

        const lastServer = servers.sort((a, b) => Date.parse(b.meta.lastSeen) - Date.parse(a.meta.lastSeen))[0];
        const onlineServers = servers.filter((s) => s.meta.online);
        
        const embed = new EmbedBuilder()
            .setTitle(attributes.name)
            .setURL(Util.playerToUrl(player.data))
            .setDescription(`
Player Id: ${inlineCode(attributes.id)}

Current server(s):    
${onlineServers.map((s) => hyperlink(s.attributes.name, Util.serverToUrl(s))).join('\n') || 'None'}
            `)
            .addFields(
                {
                    name: 'First seen',
                    value: moment(attributes.createdAt).fromNow(),
                    inline: true
                },
                {
                    name: servers.length ? 'Online for' : 'Last seen',
                    value: moment(lastServer.meta.lastSeen).fromNow(servers.length ? true : false),
                    inline: true
                }
            );

        const links = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Raw')
                    .setStyle(ButtonStyle.Link)
                    .setURL(interaction.client.BMF.uri(`players/${attributes.id}`, {
                        'include': 'server'
                    }))
            );

            const cbs = [
                {
                    command: new PlayerServersCommand() as unknown as Command,
                    button: new ButtonBuilder()
                        .setLabel('Servers')
                        .setCustomId('servers')
                        .setStyle(ButtonStyle.Primary)
                },
            ];

        super();

        super.send(interaction, embed, {
            links,
            cbs
        });
    }
}

export default PlayerStatsBuilder;