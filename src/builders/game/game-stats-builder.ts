import { CommandInteraction, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import EmbedBuilder from '../../utils/EmbedBuilder';
import { bold } from '@discordjs/builders';
import PageBuilder, { Page } from '../PageBuilder';
import { Game } from '../../types/game';
import iso3311a2 from 'iso-3166-1-alpha-2';
import GameUtils from './game-utils-builder';

class GameStatsBuilder extends PageBuilder {
    constructor(
        interaction: CommandInteraction, 
        game: Game,
    ) {
        const { attributes } = game.data;
        let i = 0;
        let j = 0;

        const attachment = new AttachmentBuilder(`./images/${game.data.id}.png`);

        const base = new EmbedBuilder()
            .setTitle(attributes.name)
            .setURL(`https://www.battlemetrics.com/servers/${game.data.id}`)
            .setThumbnail(`attachment://${game.data.id}.png`);

        const stats = new EmbedBuilder(base.data)
            .addFields(
                {
                    name: 'Total Players',
                    value: attributes.players.toLocaleString(),
                    inline: true
                },
                {
                    name: 'Total Servers',
                    value: attributes.servers.toLocaleString(),
                    inline: true
                },
                {
                    name: 'App Id',
                    value: attributes.metadata.appid?.toString() || 'Non-steam game.',
                    inline: true
                }
            );

        if (GameUtils.isEmptyObject(attributes.playersByCountry)) {
            stats.addFields(
                {
                    name: 'Top Playing By Country',
                    value: GameUtils.getTop(attributes.playersByCountry, 5)
                        .map(c => bold(++i + '. ') 
                            + iso3311a2.getCountry(c.key) + ' - ' + c.value.toLocaleString())
                        .join('\n'),
                    inline: true
                }
            );
        }

        if (GameUtils.isEmptyObject(attributes.serversByCountry)) {
            stats.addFields(
                {
                    name: 'Top Servers By Country',
                    value: GameUtils.getTop(attributes.serversByCountry, 5)
                        .map(c => bold(++j + '. ') 
                            + iso3311a2.getCountry(c.key) + ' - ' + c.value.toLocaleString())
                        .join('\n'),
                    inline: true
                }
            );
        }

        const players = new EmbedBuilder(base.data)
            .addFields(
                {
                    name: 'Min Players (24H)',
                    value: attributes.minPlayers24H.toLocaleString(),
                    inline: true
                },
                { 
                    name: '\u200B', 
                    value: '\u200B',
                    inline: true
                },
                {
                    name: 'Max Players (24H)',
                    value: attributes.maxPlayers24H.toLocaleString(),
                    inline: true
                },
                {
                    name: 'Min Players (7D)',
                    value: attributes.minPlayers7D.toLocaleString(),
                    inline: true,
                },
                { 
                    name: '\u200B', 
                    value: '\u200B',
                    inline: true
                },
                {
                    name: 'Max Players (7D)',
                    value: attributes.maxPlayers7D.toLocaleString(),
                    inline: true,
                },
                {
                    name: 'Min Players (30D)',
                    value: attributes.minPlayers30D.toLocaleString(),
                    inline: true,
                },
                { 
                    name: '\u200B', 
                    value: '\u200B',
                    inline: true
                },
                {
                    name: 'Max Players (30D)',
                    value: attributes.maxPlayers30D.toLocaleString(),
                    inline: true
                }
            );

        const pages = [
            {
                embed: stats,
                button: new ButtonBuilder()
                    .setLabel('📈 Stats')
                    .setCustomId('STATS')
                    .setStyle(ButtonStyle.Primary)
            },
            {
                embed: players,
                button: new ButtonBuilder()
                    .setLabel('⛹️ Players')
                    .setCustomId('PLAYERS')
                    .setStyle(ButtonStyle.Primary)
            }
        ] as Page[];

        super(interaction, pages, attachment);
    }
}

export default GameStatsBuilder;