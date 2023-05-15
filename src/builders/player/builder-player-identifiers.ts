import { EmbedBuilder, CommandInteraction } from 'discord.js';
import { PlayerWithIdentifers } from '../../types/players';
import Util from '../../Util';
import moment from 'moment';
import SliderBuilder from '../SliderBuilder';
import chunk from 'chunk';

class PlayerIdentifiersBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction,
        player: PlayerWithIdentifers,
    ) {
        const pages = [];

        const { attributes } = player.data;

        const identifiers = player.included.sort((a, b) => Date.parse(b.attributes.lastSeen) - Date.parse(a.attributes.lastSeen));
        const base = new EmbedBuilder()
            .setTitle(attributes.name)
            .setURL(Util.playerToUrl(player.data));
        const chunks = chunk(identifiers, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .setDescription('Players past name identifiers.')
                .addFields(
                    chunk.map(identifiers => {
                        return {
                            name: identifiers.attributes.identifier,
                            value: 'Last seen ' + moment(identifiers.attributes.lastSeen).fromNow()
                        };
                    })
                );

                pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default PlayerIdentifiersBuilder;