import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import { Player, PlayerCoplayData } from '../../types/players';
import Util from '../../Util';
import moment from 'moment';
import SliderBuilder from '../SliderBuilder';
import chunk from 'chunk';
import { BaseServerData } from '../../types/servers';

class PlayerCoplayBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction,
        player: Player,
        coplay: PlayerCoplayData,
        server?: BaseServerData
    ) {
        coplay.data.sort((a, b) => b.attributes.duration - a.attributes.duration);
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle(player.data.attributes.name)
            .setURL(Util.playerToUrl(player.data) + '/coplay')
            .setDescription('Player coplay.');

        if (server) {
            base.setDescription(base.data.description + '\n\nServer: ' + hyperlink(server.attributes.name, Util.serverToUrl(server)));
        }

        const chunks = chunk(coplay.data, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map(coplay => {
                        const duration = moment.duration(coplay.attributes.duration, 'seconds');
                        const link = hyperlink(coplay.id, `https://www.battlemetrics.com/players/${coplay.id}`);

                        return {
                            name: coplay.attributes.name,
                            value: `> Time spent ${duration.format('HH [hours] mm [mins]')} (${link})`
                        };
                    })
                );

                pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default PlayerCoplayBuilder;