import { hyperlink } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
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
            .setTitle('Player search');

        const chunks = chunk(data, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map((chunk) => {
                        return {
                            name: chunk.attributes.name,
                            value: `> Id: ${hyperlink(chunk.id, Util.playerToUrl(chunk))}`
                        };
                    })
                );

            pages.push(embed);
        }

        return pages;
    }
}

export default PlayerListBuilder;