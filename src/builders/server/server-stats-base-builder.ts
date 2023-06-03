import { CommandInteraction, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import PageBuilder, { Page } from '../PageBuilder';
import ServerLeaderboardCommand from '../../commands/server/server-leaderboard';
import ServerPlayersCommand from '../../commands/server/server-players';
import { BaseServerData } from '../../types/servers';
import ServerFavoriteCommand from '../../commands/server/server-favorite';

class ServerStatsBaseBuilder extends PageBuilder {
    constructor(
        interaction: CommandInteraction, 
        pages: Page[],
        server: BaseServerData
    ) {
        const attachment = new AttachmentBuilder(`./images/${server.relationships.game.data.id}.png`);
        
        const cbs = [
            {
                command: new ServerLeaderboardCommand(),
                button: new ButtonBuilder()
                    .setLabel('Leaderboard')
                    .setCustomId('leaderboard')
                    .setStyle(ButtonStyle.Secondary)
            },
            {
                command: new ServerPlayersCommand(),
                button: new ButtonBuilder()
                    .setLabel('Player list')
                    .setCustomId('players')
                    .setStyle(ButtonStyle.Secondary)
            },
            {
                command: new ServerFavoriteCommand(),
                button: new ButtonBuilder()
                    .setEmoji({ name: '⭐' })
                    .setCustomId('favorite')
                    .setStyle(ButtonStyle.Primary)
            }
        ];

        for (const { embed } of pages) {
            embed.setFooter({
                text: server.attributes.name,
                iconURL: `attachment://${server.relationships.game.data.id}.png`
            });
        }

        super(interaction, pages, {
            cbs,
            attachment
        });
    }
}

export default ServerStatsBaseBuilder;