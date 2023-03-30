import { Client, GatewayIntentBits } from 'discord.js';
import CommandHandler from '../CommandHandler';
import Logger from '../Logger';
import 'dotenv/config';

class BMT extends Client {
    public commands: CommandHandler;

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds]
        });

        this.commands = new CommandHandler(this, './src/commands/**/*');

        this.once('ready', () => Logger.info('Bot active!'));
    }

    public activate() {
        super.login(process.env.DISCORD_TOKEN);
    }
}

export default BMT;