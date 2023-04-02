import { SlashCommandBuilder } from '@discordjs/builders';

const GameInteraction = new SlashCommandBuilder()
    .setName('game')
    .setDescription('📝 Fetch data about a Battlemetrics game.')
    .addSubcommand(command => 
        command
            .setName('stats')
            .setDescription('Fetch game stats.')
        .addStringOption(option => 
            option
                .setName('id')
                .setDescription('The ID of the game.')
                .setRequired(true)
        )
    );

export default GameInteraction;