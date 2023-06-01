import { bold } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
import { Player, PlayerSessionDataWithServers } from '../../types/players';
import Util from '../../Util';
import moment from 'moment';
import { stripIndent } from 'common-tags';
import BuildMethodBase from '../../bases/BuildMethodBase';
import 'moment-duration-format';
import chunk from 'chunk';

class PlayerSessionBuilder extends BuildMethodBase {
    constructor(player: Player) {
        super({ 'player': player });
    }

    public build(sessions: PlayerSessionDataWithServers) {
        const player = this.map.get('player') as Player;
        const slides = [];

        const base = new EmbedBuilder()
            .setTitle(player.data.attributes.name)
            .setURL(Util.playerToUrl(player.data))
            .setDescription('Player session history.');

        const chunks = chunk(sessions.data, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map((session) => {
                        const server = sessions.included.find((server) => server.id == session.relationships.server.data.id);
                        const start = moment(session.attributes.start);
                        const stop = moment(session.attributes.stop);

                        return {
                            name: server?.attributes.name || '\u200b',
                            value: stripIndent`
                            > ${bold('Start')}: ${start.fromNow()} - ${start.format('l hh:mm a')}
                            > ${bold('Stop')}: ${stop.fromNow()} - ${stop.format('l hh:mm a')}
                            > ${bold('Duration')}: ${moment.duration(stop.diff(start)).format('*hh:mm')}
                            `
                        };
                    })
                );

            slides.push(embed);
        }

        return slides;
    }
}

export default PlayerSessionBuilder;