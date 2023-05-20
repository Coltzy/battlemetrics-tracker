import { EmbedBuilder, hyperlink } from 'discord.js';
import FitlerBuildBase from '../../bases/FilterBuildBase';
import { BaseServerData } from '../../types/servers';
import chunk from 'chunk';
import Util from '../../Util';

class ServerListBuilder extends FitlerBuildBase {
    constructor() {
        super();
    }

    build(data: BaseServerData[]): EmbedBuilder[] {
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle('Search results.');
        const chunks = chunk(data, 10);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map((chunk) => {
                        return {
                            name: chunk.attributes.name || '\u200b',
                            value: `Id: ${hyperlink(chunk.id, Util.serverToUrl(chunk))}`
                        };
                    })
                );

            pages.push(embed);
        }

        return pages;
    }
}

export default ServerListBuilder;