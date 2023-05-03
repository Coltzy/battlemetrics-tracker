import { ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import BuilderBase from './BuilderBase';
import ms from 'ms';
import Util from '../Util';

abstract class SliderBuilder extends BuilderBase {
    private pages: EmbedBuilder[];
    private index: number;

    constructor(interaction: CommandInteraction, pages: EmbedBuilder[]) {
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
            await Util.reply(interaction, {
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

        if (msg) {
            const num = parseInt(msg.content);
            if (!isNaN(num) && this.isValidIndex(num)) {
                this.index = num - 1;
            }
        }
    }

    private async search(interaction: CommandInteraction) {
        const msg = await this.awaitMessages(interaction, 'Enter a search term.');

        if (msg) {
            const re = new RegExp('#\\d[^ ]* (.*)');
            const values: string[] = [];
            this.pages.forEach(page => {
                Array.prototype.push.apply(values, page.data.fields?.map(f => f.name.match(re)?.[1]) as string[]);
            });

            const match = values.find(name => name.toLowerCase() == msg.content.toLowerCase());
            
            if (match) {
                const pos = values.indexOf(match);
                this.index = Math.round(pos / 10);
            } else {
                await interaction.channel?.send('No results found for this query.');
            }
        }
    }
}

export default SliderBuilder;