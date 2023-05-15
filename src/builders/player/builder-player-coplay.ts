import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import { Player, PlayerCoplayData } from '../../types/players';
import Util from '../../Util';
import moment from 'moment';
import SliderBuilder from '../SliderBuilder';
import chunk from 'chunk';

class PlayerCoplayBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction,
        player: Player,
        coplay: PlayerCoplayData,
    ) {
        const pages = [];

        coplay.data.sort((a, b) => b.attributes.duration - a.attributes.duration);
        const base = new EmbedBuilder()
            .setTitle(player.data.attributes.name)
            .setURL(Util.playerToUrl(player.data));
        const chunks = chunk(coplay.data, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setDescription('Player coplay.')
                .addFields(
                    chunk.map(coplay => {
                        const duration = moment.duration(coplay.attributes.duration * 1000);
                        const link = hyperlink(coplay.id, `https://www.battlemetrics.com/players/${coplay.id}`);

                        return {
                            name: coplay.attributes.name,
                            value: `Time spent ${duration.format('HH [hours] mm [mins]')} (${link})`
                        };
                    })
                );

                pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default PlayerCoplayBuilder;