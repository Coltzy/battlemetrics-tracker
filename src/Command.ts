import { AutocompleteInteraction, CommandInteraction } from 'discord.js';

interface Command {
    name?: string;
    execute(interaction: CommandInteraction): Promise<unknown> | unknown;
    autocomplete?(interaction: AutocompleteInteraction): Promise<unknown> | undefined
}

export default Command;