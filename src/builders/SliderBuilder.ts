import { ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import BuilderBase from './BuilderBase';
import ms from 'ms';

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
                .setEmoji({ name: '➡️' })
                .setCustomId('next')
                .setStyle(ButtonStyle.Primary)
        );

        super();

        this.pages = pages;

        this.index = 0;

        super.send(interaction, pages[0], {
            buttons
        });
    }

    private isValidIndex(index: number) {
        return index > 0 && index < this.pages.length + 1;
    }

    public async collect(interaction: CommandInteraction, i: ButtonInteraction<CacheType>) {
        if (i.customId == 'prev' && this.index != 0) {
            this.index--;
        } else if (i.customId == 'next' && this.index != this.pages.length - 1) {
            this.index++;
        }
        if (i.customId == 'pick') {
            await this.picker(interaction);
        }
        
        const embed = this.pages[this.index];

        if (!this.deleted) {
            await interaction.editReply({
                embeds: [embed]
            });
        }
    }

    private async picker(interaction: CommandInteraction) {
        const message = await interaction.channel?.send('Enter a page number to turn too.');

        const collection = await interaction.channel?.awaitMessages({
            time: ms('30s'),
            max: 1,
        });

        try {
            await message?.delete();
        } catch { 
            /* empty */ 
        }

        const msg = collection?.first();

        if (msg) {
            const num = parseInt(msg.content);
            if (!isNaN(num) && this.isValidIndex(num)) {
                this.index = num - 1;
            }
        }
    }
}

export default SliderBuilder;