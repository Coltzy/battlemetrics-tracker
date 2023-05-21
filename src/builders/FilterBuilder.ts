import { ButtonInteraction, ButtonStyle, CommandInteraction } from 'discord.js';
import EmbedBuilder from '../utils/EmbedBuilder';
import SliderBuilder from './SliderBuilder';
import FilterBuildBase from './../bases/FilterBuildBase';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';

const UP_ARROW = '🔼';
const DOWN_ARROW = '🔽';

type FilterDescriptionFunction = (negative: boolean) => string;

export interface FilterButton {
    name: string;
    value: string;
    description: FilterDescriptionFunction | string;
    remove?: boolean;
}

class FilterBuilder extends SliderBuilder {
    private uri: string;
    private builder: FilterBuildBase;
    private filters: FilterButton[];
    private sort: string;

    constructor(
        interaction: CommandInteraction, 
        pages: EmbedBuilder[],
        uri: string, 
        builder: FilterBuildBase,
        filters: FilterButton[]
    ) {
        super(interaction, pages);

        this.uri = uri;

        this.builder = builder;

        this.filters = filters;

        /* Gets the sorting method from the uri */
        const regex = new RegExp(/https:\/\/api\.battlemetrics\.com\/.*sort=(.*)/);
        const match = uri.match(regex);
        this.sort = match ? match[1] : filters.find((filter) => filter.remove)?.value as string;

        this.descriptors(pages);
        super.set(pages, { components: [this.build()] });
    }

    public async fcollector(i: ButtonInteraction) {
        if (!this.filters.map((f) => f.value).includes(i.customId)) return;
        const customId = i.customId;
        
        if (!this.filters.find((f) => f.value == customId)?.remove && !this.sort.startsWith('-')) {
            this.sort = '-' + customId;
        } else {
            this.sort = customId;
        }

        this.uri = this.href();
        const pages = await this.fetch(this.interaction);

        this.descriptors(pages);
        await super.set(pages, { components: [this.build()] });
    }

    private async fetch(interaction: CommandInteraction) {
        const responce = await interaction.client.BMF.direct_fetch(this.uri);
        return this.builder.build(responce.data);
    }

    private href(): string {
        const url = new URL(this.uri);

        if (this.filters.find((f) => f.value == this.sort)?.remove == true) {
            url.searchParams.delete('sort');
        } else {
            url.searchParams.set('sort', this.sort);
        }

        return url.href;
    }

    private descriptors(pages: EmbedBuilder[]) {
        const filter = this.filters.find((f) => f.value == this.sort.replace('-', '')) as FilterButton;
        for (const page of pages) {
            const description = typeof filter.description == 'function' ? filter.description(this.sort.startsWith('-')) : filter.description;
            page.setDescription(description);
        }
    }

    public build() {
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sort')
                    .setDisabled(true)
                    .setLabel('Sort by')
                    .setStyle(ButtonStyle.Secondary)
            );

        for (const filter of this.filters) {
            const button = new ButtonBuilder()
                .setCustomId(filter.value)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(filter.name);

            if (this.sort.endsWith(filter.value)) {
                if (this.sort.startsWith('-')) {
                    button.setLabel(DOWN_ARROW + ' ' + button.data.label);
                } else if (!filter.remove) {
                    button.setLabel(UP_ARROW + ' ' + button.data.label);
                }

                button.setStyle(ButtonStyle.Primary);
            }

            row.addComponents(button);
        }

        return row;
    }
}

export default FilterBuilder;