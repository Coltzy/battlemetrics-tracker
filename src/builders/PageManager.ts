import { ActionRowBuilder } from '@discordjs/builders';
import { APIEmbed, ButtonBuilder, ButtonStyle, Collection, CommandInteraction, EmbedBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

export interface Page {
    embed: EmbedBuilder | APIEmbed;
    button: ButtonBuilder;
}

class PageManager {
    private modules: Collection<string, EmbedBuilder | APIEmbed>;
    private pages: Page[];
    private delete_id: string;

    constructor(pages: Page[]) {
        this.pages = pages;

        this.modules = new Collection();

        this.delete_id = '';
    }

    public GetFirstPage() {
        if (!this.pages[0].embed) {
            throw new Error('No first page found!');
        }
        
        return this.pages[0].embed;
    }

    public async collector(interaction: CommandInteraction) {
        const collector = await interaction.channel?.createMessageComponentCollector({
            time: 60 * 1000 * 2
        });

        collector?.on('collect', async (i) => {
            
            const embed = this.modules.get(i.customId);

            if (i.customId == this.delete_id) {
                try {
                    await interaction.deleteReply();
                } catch { /* empty */ }
            }
            if (embed) {
                await i.deferUpdate();

                await interaction.editReply({
                    embeds: [
                        embed
                    ]
                });
            }
        });
    }

    public row() {
        const row = new ActionRowBuilder<ButtonBuilder>();

        for (const page of this.pages) {
            if (page.embed && page.button) {
                const id = uuidv4();
                page.button.setCustomId(id);
                this.modules.set(id, page.embed);
                row.addComponents(page.button);
            }
        }

        const id = uuidv4();
        row.addComponents(
            new ButtonBuilder()
                .setEmoji('🗑️')
                .setStyle(ButtonStyle.Danger)
                .setCustomId(id)
        );

        this.delete_id = id;

        return row;
    }
}

export default PageManager;