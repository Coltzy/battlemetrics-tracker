import { Client, Collection, Events } from 'discord.js';
import Command from './Command';
import Logger from './Logger';
import glob from 'glob';
import path from 'path';

class CommandHandler {
    public modules: Collection<string, Command>;
    private dir: string;
    private client: Client;

    constructor(client: Client, dir: string) {
        this.modules = new Collection();

        this.dir = dir;

        this.client = client;

        client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            const name = interaction.commandName;

            const command = this.modules.get(name);

            if (command) {
                try {
                    await command.execute(interaction);
                } catch (err) {
                    Logger.error(`An error has occured whilst executing command: ${name}`);
                    console.error(err);
                }
            }
        });

        this.load();
    }

    private async load() {
        const files = glob.sync(this.dir);

        for (const dir of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { default: Base } = require(path.resolve(dir));
            const command = new Base();

            command.client = this.client;
            this.modules.set(command.name, command);
        }
    }
}

export default CommandHandler;