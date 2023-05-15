import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import SliderBuilder from '../SliderBuilder';
import { BaseServerData } from '../../types/servers';
import chunk from 'chunk';
import Util from '../../Util';

class ServerListBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction, 
        servers: BaseServerData[],
    ) {
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle('Search results.');
        const chunks = chunk(servers, 10);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map((chunk) => {
                        return {
                            name: chunk.attributes.name,
                            value: `Id: ${hyperlink(chunk.id, Util.serverToUrl(chunk))}`
                        };
                    })
                );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default ServerListBuilder;