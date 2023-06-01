import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import Command from '../../../Command';
import ServerModel from '../../../models/ServerModel';

class ServerAutocompleteCommand implements Command {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async execute(_: CommandInteraction) {
        throw new Error("Execute method has not been initialized.");
    }

    public async autocomplete(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused();
        const docs = await ServerModel.find({ user: interaction.user.id });
        const choices  = docs.map((doc) => ({ name: doc.name, value: doc.id }));

        await interaction.respond(
            choices.filter((choice) => choice.name.startsWith(focused))
        );
    }
}

export default ServerAutocompleteCommand;