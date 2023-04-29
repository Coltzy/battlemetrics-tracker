import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import BuilderBase, { SendOptions } from './BuilderBase';
import { ButtonInteraction, CacheType, CommandInteraction } from 'discord.js';
import { APIButtonComponentWithCustomId } from 'discord-api-types/v10';
import Command from '../Command';

interface Page {
    embed: EmbedBuilder;
    button: ButtonBuilder;
}

/* TODO: Improve by passing result params */
export interface CommandButton {
    command: Command;
    button: ButtonBuilder;
}

class PageBuilder extends BuilderBase {
    private pages: Page[];

    constructor(interaction: CommandInteraction, pages: Page[], options: SendOptions) {
        super();

        this.pages = pages;
        
        const page = this.getFirstPage();
        const buttons = this.buildRow();

        super.send(interaction, page, {
            buttons,
            ...options
        });
    }

    public async collect(interaction: CommandInteraction, i: ButtonInteraction<CacheType>) {
        const embed = this.pages.find(page => {
            const { custom_id } = page.button.data as APIButtonComponentWithCustomId;
            if (custom_id == i.customId) {
                return page;
            }
        })?.embed;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await super.send(interaction, embed!);
    }

    private buildRow() {
        const row = new ActionRowBuilder<ButtonBuilder>();
        for (const page of this.pages) {
            row.addComponents(page.button);
        }

        return row;
    }

    private getFirstPage() {
        if (!this.pages[0].embed) {
            throw new Error('First page is missing an embed!');
        }

        return this.pages[0].embed;
    }
}

export default PageBuilder;