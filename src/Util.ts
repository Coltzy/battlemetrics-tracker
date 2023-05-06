import { CommandInteraction, InteractionReplyOptions } from 'discord.js';
import { BaseServerData } from './types/servers';
import { PlayerData } from './types/players';

class Util {
    static async reply(interaction: CommandInteraction, options: InteractionReplyOptions | string) {
        if (interaction.replied) {
            await interaction.editReply(options);

            return;
        }

        await interaction.reply(options);
    }

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