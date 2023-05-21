import { CommandInteraction, inlineCode, hyperlink, quote } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
import BuilderBase from '../BuilderBase';
import { PlayerWithServerMeta } from '../../types/players';
import moment from 'moment';
import Util from '../../Util';
import { stripIndent } from 'common-tags';
import 'moment-duration-format';

class PlayerStatsBuilder extends BuilderBase {
    constructor(
        interaction: CommandInteraction,
        player: PlayerWithServerMeta,
    ) {
        player.included.sort((a, b) => Date.parse(b.meta.lastSeen) - Date.parse(a.meta.lastSeen));
        const online = player.included.filter((s) => s.meta.online);
        
        const embed = new EmbedBuilder()
            .setTitle(player.data.attributes.name)
            .setURL(Util.playerToUrl(player.data))
            .setDescription(stripIndent`
            Player Id: ${inlineCode(player.data.attributes.id)}

            Current server(s):    
            ${online.map((s) => hyperlink(s.attributes.name, Util.serverToUrl(s))).join('\n') || 'Not online'}
            `)
            .addFields(
                {
                    name: 'First seen',
                    value: quote(moment(player.data.attributes.createdAt).fromNow()),
                    inline: true
                },
                {
                    name: 'Last seen',
                    value: quote(online.length ? 'now' : moment(player.included[0]?.meta.lastSeen || player.data.attributes.createdAt).fromNow()),
                    inline: true
                }
            );

        // TODO: Fix cbs with base builder
        // const cbs = [
        //     {
        //         command: new PlayerServersCommand() as unknown as Command,
        //         button: new ButtonBuilder()
        //             .setLabel('Servers')
        //             .setCustomId('servers')
        //             .setStyle(ButtonStyle.Primary)
        //     },
        // ];

        super(interaction);

        super.respond({
            embeds: [embed]
        });
    }
}

export default PlayerStatsBuilder;