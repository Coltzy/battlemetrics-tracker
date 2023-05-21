import { CommandInteraction } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
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
        player.included.sort((a, b) => Date.parse(b.attributes.lastSeen) - Date.parse(a.attributes.lastSeen));
        const pages = [];

        const base = new EmbedBuilder()
            .setTitle(player.data.attributes.name)
            .setURL(Util.playerToUrl(player.data))
            .setDescription('Players past name identifiers.');
            
        const chunks = chunk(player.included, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map(identifiers => {
                        return {
                            name: identifiers.attributes.identifier,
                            value: '> Last seen ' + moment(identifiers.attributes.lastSeen).fromNow()
                        };
                    })
                );

                pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default PlayerIdentifiersBuilder;