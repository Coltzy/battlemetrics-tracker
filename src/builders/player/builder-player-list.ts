import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import { Player } from '../../types/players';
import Util from '../../Util';
import SliderBuilder from '../SliderBuilder';
import chunk from 'chunk';

class PlayerListBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction,
        players: Player[],
    ) {
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle('Search results.');
        const chunks = chunk(players, 10);
        let index = 1;

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setFooter({ text: `Page ${index++}/${chunks.length}` })
                .addFields(
                    chunk.map((chunk) => {
                        return {
                            name: chunk.data.attributes.name,
                            value: `Id: ${hyperlink(chunk.data.id, Util.playerToUrl(chunk.data))}`
                        };
                    })
                );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default PlayerListBuilder;