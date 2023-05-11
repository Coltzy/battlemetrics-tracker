import { CommandInteraction, InteractionReplyOptions } from 'discord.js';
import { BaseServerData } from './types/servers';
import { PlayerData } from './types/players';

declare module 'discord.js' {
    interface CommandInteraction {
        respond: (content: InteractionReplyOptions | string) => void;
    }
}

CommandInteraction.prototype.respond = async function (content: InteractionReplyOptions | string) {
    if (this.replied) {
        await this.editReply(content);

        return;
    }

    await this.reply(content);
};

class Util {
    static serverToUrl(server: BaseServerData) {
        return `https://www.battlemetrics.com/servers/${server.relationships.game.data.id}/${server.id}`;
    }

    static playerToUrl(player: PlayerData) {
        return `https://www.battlemetrics.com/players/${player.id}`;
    }

    static serverHasPlayerList(type: string) {
        return [
            'csgo', 'rust', 'ark',
            'gmod', 'squad', 'cs',
            'tf2', 'hll', 'arma3',
            'unturned', 'zomboid', 'css',
            'vrising', 'rs2vietnam', 'sandstorm',
            'postscriptum', 'btw',
        ].includes(type);
    }
}

export default Util;