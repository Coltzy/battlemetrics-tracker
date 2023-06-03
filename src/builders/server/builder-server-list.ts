import { hyperlink } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
import FitlerBuildBase from '../../bases/BuildMethodBase';
import { BaseServerData } from '../../types/servers';
import chunk from 'chunk';
import Util from '../../Util';

class ServerListBuilder extends FitlerBuildBase {
    constructor() {
        super();
    }

    build(data: BaseServerData[]): EmbedBuilder[] {
        const slides = [];

        const base = new EmbedBuilder()
            .setTitle('Search search');

        const chunks = chunk(data, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    ...chunk.map((chunk) => {
                        return {
                            name: chunk.attributes.name || '\u200b',
                            value: `> Id: ${hyperlink(chunk.id, Util.serverToUrl(chunk))}`
                        };
                    })
                );

            slides.push(embed);
        }

        return slides;
    }
}

export default ServerListBuilder;