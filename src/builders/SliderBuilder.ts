import { ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, inlineCode } from '@discordjs/builders';
import BuilderBase from './BuilderBase';
import fuzzysort from 'fuzzysort';
import ms from 'ms';

interface SliderOptions {
    searchRegex: RegExp;
}

abstract class SliderBuilder extends BuilderBase {
    private options: SliderOptions | undefined;
    private pages: EmbedBuilder[];
    private index: number;

    constructor(interaction: CommandInteraction, pages: EmbedBuilder[], options?: SliderOptions) {
        const buttons = new ActionRowBuilder<ButtonBuilder>();
        buttons.addComponents(
            new ButtonBuilder()
                .setEmoji({ name: '⬅️' })
                .setCustomId('prev')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setEmoji({ name: '🗒️' })
                .setCustomId('pick')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setEmoji({ name: '🔍' })
                .setCustomId('search')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setEmoji({ name: '➡️' })
                .setCustomId('next')
                .setStyle(ButtonStyle.Primary)
        );

        super();

        this.pages = pages;

        this.index = 0;

        this.options = options;

        super.send(interaction, pages[0], this.pages.length > 1 ? {
            buttons
        } : undefined);

        super.slider = true;
    }

    private isValidIndex(index: number) {
        return index > 0 && index < this.pages.length + 1;
    }

    public async collect(interaction: CommandInteraction, i: ButtonInteraction<CacheType>) {
        if (i.customId == 'prev' && this.index != 0) {
            this.index--;
        } else if (i.customId == 'next' && this.index != this.pages.length - 1) {
            this.index++;
        } else if (i.customId == 'search') {
            await this.search(interaction);
        } else if (i.customId == 'pick') {
            await this.picker(interaction);
        }
        
        const embed = this.pages[this.index];

        if (!this.deleted) {
            await interaction.respond({
                embeds: [embed]
            });
        }
    }

    private async awaitMessages(interaction: CommandInteraction, prompt: string) {
        const message = await interaction.channel?.send(prompt);

        const collection = await interaction.channel?.awaitMessages({
            time: ms('30s'),
            max: 1,
        });

        try {
            await message?.delete();
        } catch { 
            /* empty */ 
        }

        return collection?.first();
    }

    private async picker(interaction: CommandInteraction) {
        const msg = await this.awaitMessages(interaction, 'Enter a page number to turn too.');

        if (msg && msg.content) {
            const num = parseInt(msg.content);
            if (!isNaN(num) && this.isValidIndex(num)) {
                this.index = num - 1;
            }
        }
    }

    private async search(interaction: CommandInteraction) {
        const msg = await this.awaitMessages(interaction, 'Enter a search term.');

        if (msg && msg.content) {
            const values: string[] = [];
            this.pages.forEach(page => {
                Array.prototype.push.apply(values, page.data.fields?.map((f) => {
                    let string = f.name;

                    if (this.options?.searchRegex) {
                        string = f.name.match(this.options.searchRegex)?.[1] as string;
                    }

                    return string;
                }) as string[]);
            });

            const matches = fuzzysort.go(msg.content, values);
            const result = typeof matches[0] == 'object' ? matches[0] : null;
            
            if (result) {
                const target = result.target;
                const pos = values.indexOf(target);
                this.index = Math.floor(pos / 10);
                await interaction.channel?.send(`Match found for ${inlineCode(target)}.`);
            } else {
                await interaction.channel?.send('No results found for this query.');
            }
        }
    }
}

export default SliderBuilder;