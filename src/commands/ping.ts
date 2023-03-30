import { CommandInteraction, Client } from 'discord.js';
import { inlineCode } from '@discordjs/builders';
import Command from '../Command';

class PingCommand implements Command {
    public client: Client;
    public name = 'ping';

    public constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction) {
        const sent = await interaction.reply({
            content: 'Pinging... 📊',
            fetchReply: true
        });

        const latency = (sent.createdTimestamp - interaction.createdTimestamp).toString();
        interaction.editReply(`🏓 Roundtrip latency: ${inlineCode(latency)}ms`);
    }
}

export default PingCommand;