import { CommandInteraction } from 'discord.js';

interface Command {
    name: string;
    execute(interaction: CommandInteraction): Promise<unknown> | unknown;
}

export default Command;