import { CommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import PageBuilder, { Page } from '../PageBuilder';
import ServerLeaderboardCommand from '../../commands/server/server-leaderboard';
import ServerPlayersCommand from '../../commands/server/server-players';
import { BaseServerData } from '../../types/servers';

class ServerStatsBaseBuilder extends PageBuilder {
    constructor(
        interaction: CommandInteraction, 
        pages: Page[],
        server: BaseServerData
    ) {
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

        super(interaction, pages, {
            links,
            cbs
        });
    }
}

export default ServerStatsBaseBuilder;