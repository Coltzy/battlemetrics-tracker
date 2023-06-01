import { hyperlink } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
import { PlayerSearch } from '../../types/players';
import Util from '../../Util';
import BuildMethodBase from '../../bases/BuildMethodBase';
import chunk from 'chunk';

class PlayerListBuilder extends BuildMethodBase {
    constructor() {
        super();
    }

    build(player: PlayerSearch) {
        const slides = [];

        const base = new EmbedBuilder()
            .setTitle('Player search');

        const chunks = chunk(player.data, 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder(base.toJSON())
                .addFields(
                    chunk.map((chunk) => {
                        return {
                            name: chunk.attributes.name,
                            value: `> Id: ${hyperlink(chunk.id, Util.playerToUrl(chunk))}`
                        };
                    })
                );

            slides.push(embed);
        }
        
        return slides;
    }
}

export default PlayerListBuilder;