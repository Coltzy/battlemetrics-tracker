import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { AttachmentBuilder, CommandInteraction } from 'discord.js';
import PageManager, { Page } from './PageManager';

class Builder extends PageManager {
    private links: ActionRowBuilder<ButtonBuilder>;

    constructor(
        interaction: CommandInteraction,
        links: ActionRowBuilder<ButtonBuilder>,
        pages: Page[],
        attachments?: AttachmentBuilder
    ) {
        super(pages);

        this.links = links || {};

        this.send(interaction, attachments);
    }

    private async send(interaction: CommandInteraction, attachments?: AttachmentBuilder) {
        const row = super.row();

        await interaction.reply({
            components: [
                this.links,
                row
            ],
            embeds: [
                super.GetFirstPage()
            ],
            files: attachments ? [
                attachments
            ] : [] 
        });

        super.collector(interaction);
    }
}

export default Builder;