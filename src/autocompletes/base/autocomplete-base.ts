import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import Command from '../../Command';

export type AutocompleteMethod = (interaction: AutocompleteInteraction) => Promise<void> | void;

class AutocompleteBase implements Command {
    public method: AutocompleteMethod | undefined;

    public constructor(method?: AutocompleteMethod) {
        this.method = method;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async execute(_: CommandInteraction) {
        throw new Error('Execute method has not been initialized.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public autocomplete(_: AutocompleteInteraction) {
        throw new Error("Autocomplete method has not been initialized.");
    }
}

export default AutocompleteBase;