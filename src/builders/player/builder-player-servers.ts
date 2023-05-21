import { CommandInteraction, hyperlink } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
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
        player.included.sort((a, b) => Date.parse(b.meta.lastSeen) - Date.parse(a.meta.lastSeen));
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle(player.data.attributes.name)
            .setURL(Util.playerToUrl(player.data))
            .setDescription(stripIndent`
            Players past server history.
            Seen on ${player.included.length} server(s)
            `);

        const chunks = chunk(player.included, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map(server => {
                        return {
                            name: server.attributes.name,
                            value: stripIndent`
                                > First seen: ${moment(server.meta.firstSeen).fromNow()}
                                > Time played: ${moment.duration(server.meta.timePlayed, 'seconds').format('HH [hours] mm [mins]')}
                                > Id: ${hyperlink(server.id, Util.serverToUrl(server))}
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