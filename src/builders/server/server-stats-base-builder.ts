import { CommandInteraction, AttachmentBuilder } from 'discord.js';
import PageBuilder, { Page } from '../PageBuilder';
import { BaseServerData } from '../../types/servers';

class ServerStatsBaseBuilder extends PageBuilder {
    constructor(
        interaction: CommandInteraction, 
        pages: Page[],
        server: BaseServerData
    ) {
        const attachment = new AttachmentBuilder(`./images/${server.relationships.game.data.id}.png`);

        for (const { embed } of pages) {
            embed.setFooter({
                text: server.attributes.name,
                iconURL: `attachment://${server.relationships.game.data.id}.png`
            });
        }

        super(interaction, pages, attachment);
    }
}

export default ServerStatsBaseBuilder;