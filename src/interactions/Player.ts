import { SlashCommandBuilder } from '@discordjs/builders';

const PlayerInteraction = new SlashCommandBuilder()
    .setName('player')
    .setDescription('👤 Fetch data about a Battlemetrics player.')
    .addSubcommand(command => 
        command
            .setName('stats')
            .setDescription('Fetch player stats.')
        .addStringOption(option => 
            option
                .setName('query')
                .setDescription('The ID of the player.')
                .setRequired(true)
        )
    );

export default PlayerInteraction;