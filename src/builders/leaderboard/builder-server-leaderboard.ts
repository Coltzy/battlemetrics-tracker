import { EmbedBuilder, CommandInteraction } from 'discord.js';
import SliderBuilder from '../SliderBuilder';
import { ServerLeaderboardMongoModel } from '../../types/Models';
import { Server } from '../../types/servers';
import moment from 'moment';
import chunk from 'chunk';
import 'moment-duration-format';

class ServerLeaderboardBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: Server,
        data: ServerLeaderboardMongoModel[],
    ) {
        const { attributes } = server.data;
        data.sort((a, b) => a.rank - b.rank);
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle(attributes.name);
        const chunks = chunk(data, 10);
        let index = 1;
        
        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setFooter({ text: `Last Updated: ${moment(data[0].createdAt).fromNow()} ~ Page: ${index++}/${chunks.length}` })
                .addFields(
                    chunk.map(player => {
                        const duration = moment.duration(player.value * 1000, 'ms');

                        return {
                            name: `#${player.rank} ${player.name}`,
                            value: duration.format('HH [hours] mm [mins]')
                        };
                    })
            );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default ServerLeaderboardBuilder;