import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import Command from '../../../Command';
import PlayerModel from '../../../models/PlayerModel';

class PlayerAutocompleteCommand implements Command {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async execute(_: CommandInteraction) {
        throw new Error("Execute method has not been initialized.");
    }

    public async autocomplete(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused();
        const docs = await PlayerModel.find({ user: interaction.user.id });
        const choices  = docs.map((doc) => ({ name: doc.name, value: doc.id }));

        await interaction.respond(
            choices.filter((choice) => choice.name.startsWith(focused))
        );
    }
}

export default PlayerAutocompleteCommand;