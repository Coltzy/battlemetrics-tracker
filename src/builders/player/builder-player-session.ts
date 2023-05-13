import { EmbedBuilder, CommandInteraction, bold } from 'discord.js';
import { Player, PlayerSessionDataWithServers } from '../../types/players';
import Util from '../../Util';
import moment from 'moment';
import SliderBuilder from '../SliderBuilder';
import chunk from 'chunk';
import { stripIndent } from 'common-tags';
import 'moment-duration-format';

class PlayerSessionBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction,
        player: Player,
        sessions: PlayerSessionDataWithServers,
    ) {
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle(player.data.attributes.name)
            .setURL(Util.playerToUrl(player.data));
        const chunks = chunk(sessions.data, 5);
        let index = 1;

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setDescription('Player session history.')
                .setFooter({ text: `Page: ${index++}/${chunks.length}` })
                .addFields(
                    chunk.map(session => {
                        const start = moment(session.attributes.start);
                        const stop = moment(session.attributes.stop);

                        return {
                            name: sessions.included[index - 2].attributes.name,
                            value: stripIndent`
                                ${bold('Start')}: ${start.fromNow()} - ${start.format('l hh:mm a')}
                                ${bold('Stop')}: ${stop.fromNow()} - ${stop.format('l hh:mm a')}
                                ${bold('Duration')}: ${moment.duration(stop.diff(start)).format('*hh:mm')}
                            `
                        };
                    })
                );
        
                pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default PlayerSessionBuilder;