import { EmbedBuilder, CommandInteraction, hyperlink } from 'discord.js';
import SliderBuilder from '../SliderBuilder';
import moment from 'moment';
import { Server } from '../../types/servers';
import { PlayerServerData } from '../../types/players';
import chunk from 'chunk';
import Util from '../../Util';

class ServerPlayersBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction, 
        server: Server,
    ) {
        const players = server.included?.sort((a, b) => Date.parse(a.attributes.updatedAt) - Date.parse(b.attributes.updatedAt)) as PlayerServerData[];
        const { attributes } = server.data;

        const pages = [] as EmbedBuilder[];
        const base = new EmbedBuilder()
            .setTitle(attributes.name);

        const chunks = chunk(players, 10);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setDescription('Player list.')
                .addFields(
                    chunk.map(player => {
                        return {
                            name: player.attributes.name,
                            value: `Playtime: ${moment(player.attributes.updatedAt).fromNow(true)} (${hyperlink(player.id, Util.playerToUrl(player))})`
                        };
                    })
                );

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default ServerPlayersBuilder;