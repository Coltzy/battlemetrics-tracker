import { EmbedBuilder, hyperlink } from 'discord.js';
import { PlayerData } from '../../types/players';
import Util from '../../Util';
import FitlerBuildBase from '../../bases/FilterBuildBase';
import chunk from 'chunk';

class PlayerListBuilder extends FitlerBuildBase {
    constructor() {
        super();
    }

    build(data: PlayerData[]): EmbedBuilder[] {
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle('Search results.');
        const chunks = chunk(data, 10);

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

        return pages;
    }
}

export default PlayerListBuilder;