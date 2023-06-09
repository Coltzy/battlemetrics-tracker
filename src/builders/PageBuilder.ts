import { ButtonInteraction, Collection, CommandInteraction, AttachmentBuilder, InteractionReplyOptions, APIButtonComponentWithCustomId } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import EmbedBuilder from '../utils/EmbedBuilder';
import BuilderBase from './BuilderBase';

export interface Page {
    button: ButtonBuilder;
    embed: EmbedBuilder;
}

class PageBuilder extends BuilderBase {
    private pages: Collection<string, EmbedBuilder>;
    private components: ActionRowBuilder<ButtonBuilder>[];

    constructor(interaction: CommandInteraction, pages: Page[], attachment?: AttachmentBuilder) {
        super(interaction);

        this.pages = new Collection();
        pages.map((page) => this.pages.set((page.button.data as APIButtonComponentWithCustomId).custom_id, page.embed));

        const embed = pages[0].embed;

        const row = new ActionRowBuilder<ButtonBuilder>();
        if (pages.length) pages.map((page) => row.addComponents(page.button));

        const opts = {
            embeds: [embed],
            components: [row],
            files: [attachment]
        } as InteractionReplyOptions;

        this.components = opts.components as ActionRowBuilder<ButtonBuilder>[];

        super.respond(opts);
    }

    public async collector(i: ButtonInteraction) {
        const embed = this.pages.get(i.customId) as EmbedBuilder;
        await super.respond({ components: this.components, embeds: [embed] });
    }
}

export default PageBuilder;