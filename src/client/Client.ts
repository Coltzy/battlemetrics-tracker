import { Client, GatewayIntentBits } from 'discord.js';
import CommandHandler from '../CommandHandler';
import Logger from '../Logger';
import BMF from '../framework/BMF';
import 'dotenv/config';

declare module 'discord.js' {
    interface Client {
        commands: CommandHandler;
        BMF: BMF;
    }
}

class BMT extends Client {
    public commands: CommandHandler;
    public BMF: BMF;

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        });

        this.commands = new CommandHandler(this, './src/commands/**/*.ts');

        this.BMF = new BMF();

        this.once('ready', () => Logger.info('Bot active!'));
    }

    public activate() {
        super.login(process.env.DISCORD_TOKEN);
    }
}

export default BMT;