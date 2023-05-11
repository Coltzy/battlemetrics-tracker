import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import BuilderBase, { SendOptions } from './BuilderBase';
import { ButtonInteraction, CacheType, CommandInteraction } from 'discord.js';
import { APIButtonComponentWithCustomId } from 'discord-api-types/v10';
import Command from '../Command';

export interface Page {
    embed: EmbedBuilder;
    button: ButtonBuilder;
}

/* TODO: Improve by passing result params */
export interface CommandButton {
    command: Command;
    button: ButtonBuilder;
}

class PageBuilder extends BuilderBase {
    private pages: Page[] | undefined;

    constructor(interaction: CommandInteraction, pages: Page[] | EmbedBuilder, options: SendOptions) {
        super();

        const page = !(pages instanceof EmbedBuilder) ? pages[0].embed : pages;

        const row = new ActionRowBuilder<ButtonBuilder>();
        if (this.pages) this.pages.map((p) => row.addComponents(p.button));

        super.send(interaction, page, {
            buttons: row,
            ...options
        });
    }

    public async collect(interaction: CommandInteraction, i: ButtonInteraction<CacheType>) {
        const embed = this.pages?.find(page => {
            const { custom_id } = page.button?.data as APIButtonComponentWithCustomId;
            if (custom_id == i.customId) {
                return page;
            }
        })?.embed as EmbedBuilder;

        await super.send(interaction, embed);
    }
}

export default PageBuilder;