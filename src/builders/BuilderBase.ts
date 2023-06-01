import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ButtonStyle, Collection, CommandInteraction, InteractionCollector, InteractionReplyOptions, Message } from 'discord.js';
import { APIButtonComponentWithCustomId } from 'discord-api-types/v10';
import ms from 'ms';
import Command from '../Command';
import 'dotenv/config';

/* Abstract function for other builders to access the collector */
interface BuilderBase {
    collector?(interaction: ButtonInteraction, sent: Message): void | Promise<void>; 
}

export interface CommandButton {
    button: ButtonBuilder;
    command: Command;
}
 
class BuilderBase {
    public cbs?: Collection<string, Command>;
    private cbr?: ActionRowBuilder<ButtonBuilder>;
    public deleted: boolean;
    public interaction: CommandInteraction;
    public coll: InteractionCollector<ButtonInteraction> | undefined;

    constructor(interaction: CommandInteraction, cbs?: CommandButton[]) {
        this.deleted = false;

        this.interaction = interaction;

        this.coll = undefined;

        if (cbs) {
            const row = new ActionRowBuilder<ButtonBuilder>();
            this.cbs = new Collection();

            for (const cb of cbs) {
                this.cbs.set((cb.button.data as APIButtonComponentWithCustomId).custom_id, cb.command);
                row.addComponents(cb.button);
            }

            this.cbr = row;
        }
    }

    /* Function from the collector to handle base features */
    private async collect(i: ButtonInteraction) {
        let sent;
        try {
            sent = await this.interaction.fetchReply();
        } catch { /* empty */ }

        if (sent?.id != i.message.id) return;

        /* Handles deleting interaction on button press */
        if (i.customId == 'del') {
            if (sent.deletable) await sent.delete();
            this.deleted = true;

            return;
        }

        /* Handles command buttons */
        const command = this.cbs?.get(i.customId);
        if (command) {
            await command.execute(this.interaction);
            this.coll?.stop();
            return;
        }

        await i.deferUpdate();

        if (this.collector) await this.collector(i, sent);
    }

    /* Disables all buttons in the given rows */
    private async disable(rows: ActionRowBuilder<ButtonBuilder>[]) {
        for (const { components } of rows) {
            components.map((component) => component.setDisabled(true));
        }
    }

    /* Method to respond from all builder classes */
    public async respond(options: InteractionReplyOptions) {
        const button = new ButtonBuilder()
            .setCustomId('del')
            .setEmoji({ name: '🗑️' })
            .setStyle(ButtonStyle.Danger);

        if (!options.components) options.components = [];

        if (this.cbr) {
            options.components.push(this.cbr);
        } else if (!options.components?.length) {
            options.components.push(new ActionRowBuilder<ButtonBuilder>());
        }

        const row = options.components?.[0] as ActionRowBuilder<ButtonBuilder>;
        if (!row.components.some((button) => (button.data as APIButtonComponentWithCustomId).custom_id == 'del')) {
            row.addComponents(button);
        }

        try {
            await this.interaction.respond(options);
        } catch { /* empty */ }

        if (!this.coll) {
            const collector = await this.interaction.channel?.createMessageComponentCollector({
                time: ms(process.env.INTERACTION_COLLECTOR_DURATION as string),
                filter: (i) => i.user.id == this.interaction.user.id
            });

            this.coll = collector as InteractionCollector<ButtonInteraction>;

            collector?.on('collect', (i) => this.collect(i as ButtonInteraction));

            collector?.on('end', async (_, reason) => {
                if (reason == 'time') {
                    this.disable(options.components as ActionRowBuilder<ButtonBuilder>[]);
                    await this.respond({ components: options.components });
                }
            });
        }
    }
}

export default BuilderBase;