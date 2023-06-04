import { ActivityType, Client, GatewayIntentBits } from 'discord.js';
import CommandHandler from '../CommandHandler';
import Logger from '../Logger';
import BMF from '../framework/BMF';
import Mongo from '../framework/Mongo';
import Cacher from '../utils/Cacher';
import { IDocument } from '../models/Schema';
import 'dotenv/config';

declare module 'discord.js' {
    interface Client {
        commands: CommandHandler;
        BMF: BMF;
        mongo: Mongo;
        players: Cacher<IDocument>;
        servers: Cacher<IDocument>;
    }
}

class BMT extends Client {
    public commands: CommandHandler;
    public BMF: BMF;
    public players: Cacher<IDocument>;
    public servers: Cacher<IDocument>;

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

        this.mongo = new Mongo(this);

        this.players = new Cacher();

        this.servers = new Cacher();

        this.once('ready', () => {
            Logger.info('Bot active!');

            this.user?.setActivity('battlemetrics', { type: ActivityType.Watching });
        });
    }

    public activate() {
        super.login(process.env.DISCORD_TOKEN);
        this.mongo.connect();
    }
}

export default BMT;