import { Client, Collection, Events } from 'discord.js';
import Command from './Command';
import Logger from './Logger';
import glob from 'glob';
import path from 'path';

class CommandHandler {
    public modules: Collection<string, Command>;
    private dir: string;

    constructor(client: Client, dir: string) {
        this.modules = new Collection();

        this.dir = dir;

        client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

            const sub = interaction.options.getSubcommand(false);
            let name = interaction.commandName;
            let command;

            if (sub) {
                name = name + '-' + sub;
                command = this.modules.get(name);
            } else {
                command = this.modules.get(name);
            }

            if (!command) return;

            try {
                if (interaction.isAutocomplete()) {
                    await command.autocomplete?.(interaction);
                } else {
                    await command.execute(interaction);
                    Logger.info(`Command ${command.name} was used.`);
                }
            } catch (err) {
                Logger.error(`An error has occured whilst executing command: ${name}`);
                console.error(err);
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
            
            if (command.name) {
                this.modules.set(command.name, command);
            }
        }
    }
}

export default CommandHandler;