import { CommandInteraction, TimestampStyles, hyperlink, time } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
import SliderBuilder from '../SliderBuilder';
import moment from 'moment';
import { ServerWithPlayerList } from '../../types/servers';
import { PlayerServerData } from '../../types/players';
import chunk from 'chunk';
import Util from '../../Util';

class ServerPlayersBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: ServerWithPlayerList,
    ) {
        server.included.sort((a, b) => Date.parse(a.attributes.updatedAt) - Date.parse(b.attributes.updatedAt)) as PlayerServerData[];
        const pages = [];
        
        const base = new EmbedBuilder()
            .setTitle(server.data.attributes.name)
            .setDescription('Player list.');

        const chunks = chunk(server.included, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    ...chunk.map((player) => {
                        const date = moment(player.attributes.updatedAt);

                        return {
                            name: player.attributes.name,
                            value: `> Playtime: ${time(date.unix(), TimestampStyles.RelativeTime)} (${hyperlink(player.id, Util.playerToUrl(player))})`
                        };
                    })
                );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default ServerPlayersBuilder;