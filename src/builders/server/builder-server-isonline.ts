import { EmbedBuilder, CommandInteraction, inlineCode } from 'discord.js';
import SliderBuilder from '../SliderBuilder';
import { Server } from '../../types/servers';
import { PlayerServerData } from '../../types/players';
import moment from 'moment';
import { stripIndent } from 'common-tags';
import Util from '../../Util';

class ServerIsonlineBuilder extends SliderBuilder {
    constructor(
        interaction: CommandInteraction,
        server: Server,
        players: PlayerServerData[],
    ) {
        const pages = [];
        let index = 1;

        for (const player of players) {
            const { attributes } = player;

            const embed = new EmbedBuilder()
                .setTitle(attributes.name)
                .setURL(Util.playerToUrl(player))
                .setDescription(stripIndent`
                    Online on: [${server.data.attributes.name}](${Util.serverToUrl(server.data)})

                    Player Id: ${inlineCode(attributes.id)}
                `)
                .addFields(
                    {
                        name: 'First Seen',
                        value: moment(attributes.createdAt).fromNow(),
                        inline: true
                    },
                    {
                        name: 'Online for',
                        value: moment(attributes.updatedAt).fromNow(true),
                        inline: true
                    }
                );

            if (players.length > 1) {
                embed.setFooter({ text: `Player: ${index++}/${players.length}` });
            }

            pages.push(embed);
        }

        super(interaction, pages);
    }
}

export default ServerIsonlineBuilder;