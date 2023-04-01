import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import PageManager, { Page } from './PageManager';

class Builder extends PageManager {
    private links: ActionRowBuilder<ButtonBuilder>;

    constructor(
        interaction: CommandInteraction,
        links: ActionRowBuilder<ButtonBuilder>,
        pages: Page[]
    ) {
        super(pages);

        this.links = links;

        this.send(interaction);
    }

    private async send(interaction: CommandInteraction) {
        const row = super.row();

        await interaction.reply({
            components: [
                this.links,
                row
            ],
            embeds: [
                super.GetFirstPage()
            ]
        });

        super.collector(interaction);
    }
}

export default Builder;