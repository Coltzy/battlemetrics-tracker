import { EmbedBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import BuilderBase from '../BuilderBase';
import { bold } from '@discordjs/builders';
import { GameData } from '../../types/game';
import { GAME_TITLES } from '../../Constants';
import iso3311a2 from 'iso-3166-1-alpha-2';
import GameUtils from './GameUtils';

class GameStatsBuilder extends BuilderBase {
    constructor(
        interaction: CommandInteraction, 
        game: GameData,
    ) {
        const { attributes } = game;
        let i = 0;
        let j = 0;

        const attachment = new AttachmentBuilder(`./images/${game.id}.png`);

        const stats = new EmbedBuilder()
            .setTitle(GAME_TITLES[game.id])
            .setThumbnail(`attachment://${game.id}.png`)
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

        const players = new EmbedBuilder()
            .setTitle(game.id)
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

        const links = new ActionRowBuilder<ButtonBuilder>();

        links.addComponents(
            new ButtonBuilder()
                .setLabel('Raw')
                .setStyle(ButtonStyle.Link)
                .setURL(interaction.client.BMF.uri('games', game.id))
        );

        const pages = [
            {
                embed: stats,
                button: new ButtonBuilder()
                    .setLabel('📈 Stats')
                    .setStyle(ButtonStyle.Primary)
            },
            {
                embed: players,
                button: new ButtonBuilder()
                    .setLabel('⛹️ Players')
                    .setStyle(ButtonStyle.Primary)
            }
        ];

        super(interaction, links, pages, attachment);
    }
}

export default GameStatsBuilder;