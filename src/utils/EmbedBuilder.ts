import { EmbedBuilder as Builder, EmbedAuthorOptions } from '@discordjs/builders';
import { APIEmbed, APIEmbedField, EmbedData } from 'discord.js';
import Util from '../Util';

class EmbedBuilder extends Builder {
    constructor(data?: APIEmbed | EmbedData) {
        const options = {
            ...data,
            color: 0x2B2D31
        } as APIEmbed;

        super(options);
    }

    public addFields(...fields: APIEmbedField[]) {
        fields = fields.map(({ name, value }) => ({ name: Util.strlen(name, 128), value: Util.strlen(value, 512) }));
        return super.addFields(fields);
    }

    public setAuthor(options: EmbedAuthorOptions) {
        options.name = Util.strlen(options.name, 256);
        return super.setAuthor(options);
    }

    public setDescription(description: string) {
        return super.setDescription(Util.strlen(description, 2048));
    }

    public setTitle(title: string) {
        return super.setTitle(Util.strlen(title, 256));
    }
}

export default EmbedBuilder;