import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import { PlayerWithServerMeta } from '../../types/players';
import moment from 'moment';
import Util from '../../Util';
import { stripIndent } from 'common-tags';
import SliderBuilder from '../SliderBuilder';
import chunk from 'chunk';
import 'moment-duration-format';

class PlayerServersBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction,
        player: PlayerWithServerMeta,
    ) {
        const pages = [];

        const { attributes } = player.data;

        const servers = player.included.sort((a, b) => Date.parse(b.meta.lastSeen) - Date.parse(a.meta.lastSeen));
        const base = new EmbedBuilder()
            .setTitle(attributes.name)
            .setURL(Util.playerToUrl(player.data));
        const chunks = chunk(servers, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setDescription('Players past server history.')
                .addFields(
                    chunk.map(server => {
                        return {
                            name: server.attributes.name,
                            value: stripIndent`
                                First seen: ${moment(server.meta.firstSeen).fromNow()}
                                Time played: ${moment.duration(server.meta.timePlayed * 1000, 'ms').format('HH [hours] mm [mins]')}
                                Id: ${hyperlink(server.id, Util.serverToUrl(server))}
                            `
                        };
                    })
                );

                pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default PlayerServersBuilder;