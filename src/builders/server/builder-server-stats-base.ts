import { CommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } from 'discord.js';
import PageBuilder, { Page } from '../PageBuilder';
import ServerLeaderboardCommand from '../../commands/server/server-leaderboard';
import ServerPlayersCommand from '../../commands/server/server-players';
import { BaseServerData } from '../../types/servers';
import { EmbedBuilder } from '@discordjs/builders';

class ServerStatsBaseBuilder extends PageBuilder {
    constructor(
        interaction: CommandInteraction, 
        pages: Page[] | EmbedBuilder,
        server: BaseServerData
    ) {
        const attachment = new AttachmentBuilder(`./images/${server.relationships.game.data.id}.png`);
        
        const cbs = [
            {
                command: new ServerLeaderboardCommand(),
                button: new ButtonBuilder()
                    .setLabel('🏆 Leaderboard')
                    .setCustomId('leaderboard')
                    .setStyle(ButtonStyle.Primary)
            },
            {
                command: new ServerPlayersCommand(),
                button: new ButtonBuilder()
                    .setLabel('👥 Player list')
                    .setCustomId('players')
                    .setStyle(ButtonStyle.Primary)
            },
        ];

        const links = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Raw')
                    .setStyle(ButtonStyle.Link)
                    .setURL(interaction.client.BMF.uri(`servers/${server.id}`))
            );

        const embeds = Array.isArray(pages) ? pages.map((e) => e.embed) : [pages];
        for (const embed of embeds) {
            embed.setFooter({
                text: server.attributes.name,
                iconURL: `attachment://${server.relationships.game.data.id}.png`
            });
        }

        super(interaction, pages, {
            links,
            cbs,
            attachment
        });
    }
}

export default ServerStatsBaseBuilder;