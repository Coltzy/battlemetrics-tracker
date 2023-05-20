import { EmbedBuilder, CommandInteraction, inlineCode, hyperlink, ButtonStyle } from 'discord.js';
import BuilderBase from '../BuilderBase';
import { PlayerWithServerMeta } from '../../types/players';
import moment from 'moment';
import Util from '../../Util';
import { stripIndent } from 'common-tags';
import { ButtonBuilder } from '@discordjs/builders';
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

        servers.sort((a, b) => Date.parse(b.meta.lastSeen) - Date.parse(a.meta.lastSeen));
        const online = servers.filter((s) => s.meta.online);
        
        const embed = new EmbedBuilder()
            .setTitle(attributes.name)
            .setURL(Util.playerToUrl(player.data))
            .setDescription(`Player Id: ${inlineCode(attributes.id)}`)
            .addFields(
                {
                    name: 'First seen',
                    value: moment(attributes.createdAt).fromNow(),
                    inline: true
                },
                {
                    name: 'Last seen',
                    value: online.length ? 'now' : moment(servers[0]?.meta.lastSeen || attributes.createdAt).fromNow(),
                    inline: true
                }
            );

        if (online.length) {
            embed.setDescription(stripIndent`
                ${embed.data.description}

                Current server(s):    
                ${online.map((s) => hyperlink(s.attributes.name, Util.serverToUrl(s))).join('\n') || 'None'}
            `);
        }

        // TODO: Fix cbs with base builder
        const cbs = [
            {
                command: new PlayerServersCommand() as unknown as Command,
                button: new ButtonBuilder()
                    .setLabel('Servers')
                    .setCustomId('servers')
                    .setStyle(ButtonStyle.Primary)
            },
        ];

        super(interaction);

        super.respond({
            embeds: [embed]
        });
    }
}

export default PlayerStatsBuilder;