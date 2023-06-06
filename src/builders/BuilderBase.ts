import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ButtonStyle, CommandInteraction, InteractionCollector, InteractionReplyOptions, Message } from 'discord.js';
import { APIButtonComponentWithCustomId } from 'discord-api-types/v10';
import ms from 'ms';
import 'dotenv/config';

/* Abstract function for other builders to access the collector */
interface BuilderBase {
    collector?(interaction: ButtonInteraction, sent: Message): void | Promise<void>; 
}
 
class BuilderBase {
    public deleted: boolean;
    public interaction: CommandInteraction;
    public coll: InteractionCollector<ButtonInteraction> | undefined;

    constructor(interaction: CommandInteraction) {
        this.deleted = false;

        this.interaction = interaction;

        this.coll = undefined;
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

        if (!options.components) options.components = [new ActionRowBuilder<ButtonBuilder>()];

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