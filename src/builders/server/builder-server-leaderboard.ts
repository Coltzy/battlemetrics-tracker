import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import SliderBuilder from '../SliderBuilder';
import { ServerLeaderboardMongoModel } from '../../types/Models';
import { Server } from '../../types/servers';
import moment from 'moment';
import chunk from 'chunk';
import Util from '../../Util';
import 'moment-duration-format';

class ServerLeaderboardBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: Server,
        data: ServerLeaderboardMongoModel[],
    ) {
        data.sort((a, b) => a.rank - b.rank);
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle(server.data.attributes.name)
            .setURL(Util.serverToUrl(server.data))
            .setDescription(`
                All time leaderboard of the server.

                Last Updated: ${moment(data[0].createdAt).fromNow()}
            `);

        const chunks = chunk(data, 5);
        
        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map(player => {
                        const duration = moment.duration(player.value, 'seconds');

                        return {
                            name: `#${player.rank} ${player.name}`,
                            value: `> ${duration.format('HH [hours] mm [mins]')} (${hyperlink(player.id, `https://www.battlemetrics.com/players/${player.id}`)})`
                        };
                    })
            );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default ServerLeaderboardBuilder;