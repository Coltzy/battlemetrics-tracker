import { BaseServerData } from './types/servers';
import { PlayerData } from './types/players';

class Util {
    static strlen(content: string, len: number) {
        if (content.length > len) {
            content = content.substring(0, len).slice(0, -3) + '...';
        }

        return content;
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