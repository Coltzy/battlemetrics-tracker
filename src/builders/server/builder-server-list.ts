import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import SliderBuilder from '../SliderBuilder';
import { Server } from '../../types/servers';
import chunk from 'chunk';
import Util from '../../Util';

class ServerListBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction, 
        servers: Server[],
    ) {
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle('Search results.');
        const chunks = chunk(servers, 10);
        let index = 1;

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setFooter({ text: `Page ${index++}/${chunks.length}` })
                .addFields(
                    chunk.map((chunk) => {
                        return {
                            name: chunk.data.attributes.name,
                            value: `Id: ${hyperlink(chunk.data.id, Util.serverToUrl(chunk.data))}`
                        };
                    })
                );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default ServerListBuilder;