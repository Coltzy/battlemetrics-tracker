import { APIButtonComponentWithCustomId, ButtonInteraction, ButtonStyle, CommandInteraction, InteractionReplyOptions, Message } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, inlineCode } from '@discordjs/builders';
import EmbedBuilder from '../utils/EmbedBuilder';
import BuilderBase from './BuilderBase';
import fuzzysort from 'fuzzysort';
import ms from 'ms';

interface SliderBuilder {
    fcollector(i: ButtonInteraction): Promise<void>; 
    build(): ActionRowBuilder<ButtonBuilder>;
}

class SliderBuilder extends BuilderBase {
    public slides: EmbedBuilder[];
    public index: number;
    private buttons: ActionRowBuilder<ButtonBuilder>;

    constructor(interaction: CommandInteraction, slides: EmbedBuilder[]) {
        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
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

        super(interaction);

        this.slides = slides;

        this.index = 0;

        this.buttons = buttons;

        if (!this.fcollector) this.set(slides);
    }

    public set(slides: EmbedBuilder[], options?: InteractionReplyOptions) {
        this.slides = slides;

        if (this.slides.length > 1) this.enumerate();

        this.index = 0;

        const embed = this.slides[this.index];

        const opts = {
            embeds: [embed],
            components: [],
            ...options
        } as InteractionReplyOptions;

        if (this.slides.length > 1) opts.components?.unshift(this.buttons);

        super.respond(opts);
    }

    private isValidIndex(index: number) {
        return index > 0 && index < this.slides.length + 1;
    }

    public async collector(i: ButtonInteraction, sent: Message) {
        const ids = this.buttons.components.map((button) => (button.data as APIButtonComponentWithCustomId).custom_id);

        if (!ids.includes(i.customId)) {
            this.fcollector(i);

            return;
        }

        if (i.customId == 'next' && this.index != this.slides.length - 1) {
            this.index++;
        } else if (i.customId == 'prev' && this.index != 0) {
            this.index--;
        } else if (i.customId == 'search') {
            await this.search();
        } else if (i.customId == 'pick') {
            await this.picker();
        }
        
        const embed = this.slides[this.index];
        const json = sent.embeds[0].toJSON();
        delete json.type;

        if (!this.deleted) {
            await this.interaction.respond({ embeds: [embed] });
        }
    }

    private enumerate() {
        if (this.slides.length < 1) return;
        let i = 1;

        for (const slide of this.slides) {
            slide.setFooter({ text: `Slide: ${i++}/${this.slides.length}` });
        }
    }

    private async awaitMessages(prompt: string) {
        const message = await this.interaction.channel?.send(prompt);

        const collection = await this.interaction.channel?.awaitMessages({
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

    private async picker() {
        const msg = await this.awaitMessages('Enter a slide number to turn too.');

        if (msg && msg.content) {
            const num = parseInt(msg.content);
            if (!isNaN(num) && this.isValidIndex(num)) {
                this.index = num - 1;
            }
        }
    }

    private async search() {
        const msg = await this.awaitMessages('Enter a search term.');

        if (msg && msg.content) {
            const values: string[] = [];
            this.slides.forEach((slides) => {
                Array.prototype.push.apply(values, slides.data.fields?.map((f) => f.name) as string[]);
            });

            const matches = fuzzysort.go(msg.content, values);
            const result = typeof matches[0] == 'object' ? matches[0] : null;
            
            if (result) {
                const target = result.target;
                const pos = values.indexOf(target);
                this.index = Math.floor(pos / 10);
                await this.interaction.channel?.send(`Match found for ${inlineCode(target)}.`);
            } else {
                await this.interaction.channel?.send('No results found for this query.');
            }
        }
    }
}

export default SliderBuilder;