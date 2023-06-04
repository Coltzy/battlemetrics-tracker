import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import Command from '../../../Command';

class PlayerAutocompleteCommand implements Command {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async execute(_: CommandInteraction) {
        throw new Error("Execute method has not been initialized.");
    }

    public async autocomplete(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused().toLowerCase();
        const docs = interaction.client.players.get(interaction.user.id);

        if (docs) {
            const choices  = docs.map((doc) => ({ name: doc.name, value: doc.id }));

            await interaction.respond(
                choices.filter((choice) => choice.name.toLowerCase().startsWith(focused))
            );
        }
    }
}

export default PlayerAutocompleteCommand;