import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CommandInteraction, InteractionReplyOptions } from 'discord.js';
import { PaginationLinks } from "../types/servers";
import BuildMethodBase from '../bases/BuildMethodBase';
import EmbedBuilder from '../utils/EmbedBuilder';
import SliderBuilder from './SliderBuilder';

interface PaginationBuilder {
    fcollector?(i: ButtonInteraction): Promise<void> | void;
    row(): ActionRowBuilder<ButtonBuilder>;
    descriptions(embeds: EmbedBuilder[]): void
}

class PaginationBuilder extends SliderBuilder {
    public links: PaginationLinks;
    public builder: BuildMethodBase;

    constructor(
        interaction: CommandInteraction,
        slides: EmbedBuilder[],
        links: PaginationLinks, 
        builder: BuildMethodBase
    ) {
        super(interaction, slides, true);

        this.links = links;

        this.builder = builder;

        if (!this.fcollector) {
            this.set(slides);
        }
    }

    public async subcollector(i: ButtonInteraction) {
        if (this.fcollector) this.fcollector(i);

        const { customId } = i;

        if (customId == 'next' && this.index == this.slides.length - 1) {
            const { next } = this.links;

            if (next) {
                const embeds = await this.fetch(next);
                const slides = [...this.slides, ...embeds];
                let buttons;

                if (this.fcollector) {
                    this.descriptions(slides);
                    buttons = this.row();
                }

                const options = {} as InteractionReplyOptions;

                if (buttons) {
                    options.components = [buttons];
                }
 
                this.set(slides, this.index + 1, options);
            }
        }
    }

    public async fetch(uri: string, clear = false) {
        const response = await this.interaction.client.BMF.direct_fetch(uri);
        this.links = response.links || {};

        if (clear) {
            this.slides = [];
        }

        return this.builder.build(response);
    }
}

export default PaginationBuilder;