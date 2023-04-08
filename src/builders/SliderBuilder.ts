import { ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import BuilderBase from './BuilderBase';

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

    public async collect(interaction: CommandInteraction, i: ButtonInteraction<CacheType>) {
        if (i.customId == 'prev' && this.index != 0) {
            this.index--;
        } else if (i.customId == 'next' && this.index != this.pages.length - 1) {
            this.index++;
        }
        
        const embed = this.pages[this.index];

        await interaction.editReply({
            embeds: [embed]
        });
    }
}

export default SliderBuilder;