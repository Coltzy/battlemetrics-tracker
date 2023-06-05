import { CommandInteraction, InteractionReplyOptions } from "discord.js";

CommandInteraction.prototype.respond = async function (options: InteractionReplyOptions | string) {
    if (this.replied) {
        await this.editReply(options);

        return;
    }

    await this.reply(options);

    if (typeof options != 'string' && options.fetchReply) return this.fetchReply();
};