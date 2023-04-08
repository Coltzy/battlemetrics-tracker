import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { AttachmentBuilder, ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, Embed, InteractionCollector, InteractionEditReplyOptions } from 'discord.js';
import ms from 'ms';

export interface SendOptions {
    buttons?: ActionRowBuilder<ButtonBuilder>;
    links?: ActionRowBuilder<ButtonBuilder>;
    attachment?: AttachmentBuilder;
}

abstract class BuilderBase {
    private collector: InteractionCollector<ButtonInteraction> | undefined;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        this.collector = undefined;
    }

    private async disable(interaction: CommandInteraction, buttons: ActionRowBuilder<ButtonBuilder>[]) {
        for (const row of buttons) {
            for (const component of row.components) {
                if (component.data.style != ButtonStyle.Link) component.setDisabled(true);
            }
        }

        await interaction.editReply({ components: buttons });
    }

    private async startCollector(interaction: CommandInteraction, components: ActionRowBuilder<ButtonBuilder>[]) {
        this.collector = await interaction.channel?.createMessageComponentCollector({
            filter: (i) => i.user.id == interaction.user.id,
            time: ms('2m')
        }) as InteractionCollector<ButtonInteraction>;

        const message = await interaction.fetchReply();

        this.collector?.on('collect', async (i) => {
            if (message.id != i.message.id) return;

            if (i.customId == 'del') {
                try {
                    await interaction.deleteReply();
                    this.collector?.stop();
                } catch {
                    /* empty */
                }

                return;
            }

            await i.deferUpdate();
            this.collect(interaction, i as ButtonInteraction<CacheType>);
        });

        this.collector?.once('end', (_, reason) => {
            if (reason == 'time') this.disable(interaction, components);
        });
    }

    public async send(
        interaction: CommandInteraction, 
        embed: EmbedBuilder | Embed, 
        {
            buttons = new ActionRowBuilder<ButtonBuilder>(),
            links,
            attachment
        }: SendOptions = {}
    ) {
        const components = [];

        buttons.addComponents(
            new ButtonBuilder()
                .setEmoji({ name: '🗑️' })
                .setCustomId('del')
                .setStyle(ButtonStyle.Danger)
        );

        if (buttons) components.push(buttons);
        if (links) components.push(links);

        if (interaction.replied) {
            const message = await interaction.fetchReply();

            const options: InteractionEditReplyOptions = {
                embeds: [embed],
            };

            if (!message.components.length) options.components = components;
            if (!message.attachments.size && attachment) options.files = [attachment];

            await interaction.editReply(options);

            if (!this.collector) {
                this.startCollector(interaction, components);
            }

            return;
        }

        await interaction.reply({
            embeds: [embed],
            components,
            files: attachment ? 
                [attachment] : []
        });

        this.startCollector(interaction, components);
    }

    abstract collect(interaction: CommandInteraction, i: ButtonInteraction<CacheType>): void | Promise<void>;
}

export default BuilderBase;