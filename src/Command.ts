import { CommandInteraction } from 'discord.js';

interface Command {
    name: string;
    execute(interaction: CommandInteraction): Promise<void> | void;
}

export default Command;