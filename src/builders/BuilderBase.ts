import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { AttachmentBuilder, ButtonInteraction, ButtonStyle, CacheType, Collection, CommandInteraction, Embed, InteractionCollector, InteractionReplyOptions } from 'discord.js';
import { APIButtonComponentWithCustomId } from 'discord-api-types/v10';
import ms from 'ms';
import { CommandButton } from './PageBuilder';
import Command from '../Command';
import Util from '../Util';

export interface SendOptions {
    buttons?: ActionRowBuilder<ButtonBuilder>;
    links?: ActionRowBuilder<ButtonBuilder>;
    attachment?: AttachmentBuilder;
    cbs?: CommandButton[];
}

interface BuilderBase {
    collect?(interaction: CommandInteraction, i: ButtonInteraction<CacheType>): void | Promise<void>; 
}

class BuilderBase {
    private cbs: Collection<string, Command>;
    private collector: InteractionCollector<ButtonInteraction> | undefined;
    public slider: boolean | undefined;
    public deleted: boolean | undefined;

    constructor() {
        this.cbs = new Collection();

        this.collector = undefined;

        this.slider = undefined;

        this.deleted = undefined;
    }

    private async disable(interaction: CommandInteraction, buttons: ActionRowBuilder<ButtonBuilder>[]) {
        for (const row of buttons) {
            for (const component of row.components) {
                if (component.data.style != ButtonStyle.Link) component.setDisabled(true);
            }
        }

        await Util.reply(interaction, { components: buttons });
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
                    this.deleted = true;
                    await interaction.deleteReply();
                    this.collector?.stop();
                } catch {
                    /* empty */
                }

                return;
            }

            /* Handling command buttons */
            const command = this.cbs.get(i.customId);
            if (command) {
                await command.execute(interaction);
                this.collector?.stop();
                return;
            }

            await i.deferUpdate();

            this.collect?.(interaction, i as ButtonInteraction<CacheType>);
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
            attachment,
            cbs
        }: SendOptions = {}
    ) {
        const components = [];

        const del = new ButtonBuilder()
                .setEmoji({ name: '🗑️' })
                .setCustomId('del')
                .setStyle(ButtonStyle.Danger);

        if (!cbs?.length || buttons.components.length) {
            buttons.addComponents(del);
        }

        if (buttons.components.length) components.push(buttons);

        if (cbs) {
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(cbs.map(cb => cb.button));

            if (!buttons.components.includes(del)) {
                row.addComponents(del);
            }
            
            components.push(row);

            cbs.map(cb => this.cbs.set((cb.button.data as APIButtonComponentWithCustomId).custom_id, cb.command));
        }

        if (links) components.push(links);

        if (interaction.replied) {
            const message = await interaction.fetchReply();

            const options: InteractionReplyOptions = {
                embeds: [embed],
            };

            if (!message.components.length || this.slider) options.components = components;
            if (!message.attachments.size && attachment) options.files = [attachment];

            await Util.reply(interaction, options);

            if (!this.collector) {
                this.startCollector(interaction, components);
            }

            return;
        }

        await Util.reply(interaction, {
            embeds: [embed],
            components,
            files: attachment ? 
                [attachment] : []
        });

        this.deleted = false;

        this.startCollector(interaction, components);
    }
}

export default BuilderBase;