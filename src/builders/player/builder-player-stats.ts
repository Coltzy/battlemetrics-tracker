import { EmbedBuilder, CommandInteraction, inlineCode, hyperlink, ButtonInteraction, CacheType, ButtonStyle } from 'discord.js';
import BuilderBase from '../BuilderBase';
import { Player } from '../../types/players';
import moment from 'moment';
import Util from '../../Util';
import 'moment-duration-format';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';

class PlayerStatsBuilder extends BuilderBase {
    constructor(
        interaction: CommandInteraction,
        player: Player,
    ) {
        const { attributes } = player.data;
        const { included: servers } = player;

        const lastServer = servers.sort((a, b) => Date.parse(b.meta.lastSeen) - Date.parse(a.meta.lastSeen))[0];
        const onlineServers = servers.filter((s) => s.meta.online);
        
        const embed = new EmbedBuilder()
            .setTitle(attributes.name)
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

        super();

        super.send(interaction, embed, {
            links
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    collect(interaction: CommandInteraction<CacheType>, i: ButtonInteraction<CacheType>) {}
}

export default PlayerStatsBuilder;