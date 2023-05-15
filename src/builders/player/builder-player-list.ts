import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import { PlayerData } from '../../types/players';
import Util from '../../Util';
import SliderBuilder from '../SliderBuilder';
import chunk from 'chunk';

class PlayerListBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction,
        players: PlayerData[],
    ) {
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle('Search results.');
        const chunks = chunk(players, 10);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map((chunk) => {
                        return {
                            name: chunk.attributes.name,
                            value: `Id: ${hyperlink(chunk.id, Util.playerToUrl(chunk))}`
                        };
                    })
                );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default PlayerListBuilder;