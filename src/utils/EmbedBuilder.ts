import { EmbedBuilder as Builder } from '@discordjs/builders';
import { APIEmbed, EmbedData } from 'discord.js';

class EmbedBuilder extends Builder {
    constructor(data?: APIEmbed | EmbedData) {
        const options = {
            ...data,
            color: 0x2B2D31
        } as APIEmbed;

        super(options);
    }
}

export default EmbedBuilder;