import { EmbedBuilder, CommandInteraction, inlineCode } from 'discord.js';
import SliderBuilder from '../SliderBuilder';
import moment from 'moment';
import chunk from 'chunk';
import 'moment-duration-format';
import { Server } from '../../types/servers';

class ServerPlayersBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: Server,
    ) {
        const players = server.included?.sort((a, b) => Date.parse(a.attributes.updatedAt) - Date.parse(b.attributes.updatedAt));
        const { attributes } = server.data;

        const pages = [] as EmbedBuilder[];
        const base = new EmbedBuilder()
            .setTitle(attributes.name);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const chunks = chunk(players!, 10);
        let index = 1;

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setDescription('Player list.')
                .setFooter({ text: `Page: ${index++}/${chunks.length}` })
                .addFields(
                    chunk.map(player => {
                        return {
                            name: player.attributes.name + ' ' + inlineCode(player.attributes.id),
                            value: 'Playtime: ' + moment(player.attributes.updatedAt).fromNow(true)
                        };
                    })
                );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default ServerPlayersBuilder;