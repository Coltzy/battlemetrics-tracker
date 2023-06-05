import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import Command from '../../../Command';

type AutocompleteMethod = (interaction: AutocompleteInteraction) => Promise<void> | void;

class PlayerAutocompleteCommand implements Command {
    private method: AutocompleteMethod | undefined;

    public constructor(method?: AutocompleteMethod) {
        this.method = method;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async execute(_: CommandInteraction) {
        throw new Error("Execute method has not been initialized.");
    }

    public async autocomplete(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused(true);

        const docs = interaction.client.players.get(interaction.user.id);
        const query = focused.value;

        if (docs && focused.name == 'player') {
            const choices  = docs.map((doc) => ({ name: doc.name, value: doc.id }));

            await interaction.respond(
                choices.filter((choice) => choice.name.toLowerCase().startsWith(query))
            );
        } else {
            this.method?.(interaction);
        }
    }
}

export default PlayerAutocompleteCommand;