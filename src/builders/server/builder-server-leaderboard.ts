import { hyperlink } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
import FitlerBuildBase from '../../bases/BuildMethodBase';
import { Server, ServerLeaderboard } from '../../types/servers';
import moment from 'moment';
import Util from '../../Util';
import 'moment-duration-format';
import chunk from 'chunk';

class ServerLeaderboardBuilder extends FitlerBuildBase {
    constructor(server: Server) {
        super({ 'server': server });
    }

    public build(leaderboard: ServerLeaderboard) {
        leaderboard.data.sort((a, b) => a.attributes.rank - b.attributes.rank);
        const server = this.map.get('server') as Server;
        const slides = [];

        const base = new EmbedBuilder()
            .setTitle(server.data.attributes.name)
            .setURL(Util.serverToUrl(server.data))
            .setDescription('All time leaderboard of the server.');

        const chunks = chunk(leaderboard.data, 5);

        for (const lb of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(lb.map((player) => {
                    const duration = moment.duration(player.attributes.value, 'seconds');

                    return {
                        name: `#${player.attributes.rank} ${player.attributes.name}`,
                        value: `> ${duration.format('HH [hours] mm [mins]')} (${hyperlink(player.id, `https://www.battlemetrics.com/players/${player.id}`)})`
                    };
                }));

            slides.push(embed);
        }

        return slides;
    }
}

export default ServerLeaderboardBuilder;