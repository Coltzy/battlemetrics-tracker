import { Client, GatewayIntentBits } from 'discord.js';
import CommandHandler from '../CommandHandler';
import Logger from '../Logger';
import BMF from '../framework/BMF';
import Mongo from '../framework/Mongo';
import 'dotenv/config';

declare module 'discord.js' {
    interface Client {
        commands: CommandHandler;
        BMF: BMF;
        mongo: Mongo;
    }
}

class BMT extends Client {
    public commands: CommandHandler;
    public BMF: BMF;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ],
        });

        this.commands = new CommandHandler(this, './src/commands/**/*.ts');

        this.BMF = new BMF();

        this.mongo = new Mongo();

        this.once('ready', () => Logger.info('Bot active!'));
    }

    public activate() {
        super.login(process.env.DISCORD_TOKEN);
        this.mongo.connect();
    }
}

export default BMT;