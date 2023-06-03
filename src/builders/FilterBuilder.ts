import { ButtonInteraction, ButtonStyle, CommandInteraction } from 'discord.js';
import EmbedBuilder from '../utils/EmbedBuilder';
import BuildMethodBase from '../bases/BuildMethodBase';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { PaginationLinks } from '../types/servers';
import PaginationBuilder from './PaginationBuilder';

const UP_ARROW = '🔼';
const DOWN_ARROW = '🔽';

type FilterDescriptionFunction = (negative: boolean) => string;

export interface FilterButton {
    name: string;
    value: string;
    description: FilterDescriptionFunction | string;
    remove?: boolean;
}

class FilterBuilder extends PaginationBuilder {
    private uri: string;
    private filters: FilterButton[];
    private sort: string;

    constructor(
        interaction: CommandInteraction, 
        slides: EmbedBuilder[],
        uri: string,
        links: PaginationLinks,
        builder: BuildMethodBase,
        filters: FilterButton[]
    ) {
        super(interaction, slides, links, builder);

        this.uri = uri;

        this.filters = filters;

        /* Gets the sorting method from the uri */
        const regex = new RegExp(/https:\/\/api\.battlemetrics\.com\/.*sort=(.*)&/);
        const match = uri.match(regex);
        this.sort = match ? match[1] : filters.find((filter) => filter.remove)?.value as string;

        this.descriptions(slides);
        this.set(slides, 0, { components: [this.row()] });
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

        const embeds = await this.fetch(this.uri, true);
        const slides = [...this.slides, ...embeds];
        this.descriptions(slides);

        await this.set(slides, 0, {
            components: [this.row()]
        });
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

    public async descriptions(embeds: EmbedBuilder[]) {
        const filter = this.filters.find((f) => f.value == this.sort.replace('-', '')) as FilterButton;
        const description = typeof filter.description == 'function' ? filter.description(this.sort.startsWith('-')) : filter.description;

        for (const embed of embeds) {
            embed.setDescription(description);
        }
    }

    public row() {
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