import { SlashCommandBuilder } from '@discordjs/builders';

const ServerInteraction = new SlashCommandBuilder()
    .setName('server')
    .setDescription('📊 Fetch data about a Battlemetrics server.')
    .addSubcommand(command => 
        command
            .setName('stats')
            .setDescription('Fetch server stats.')
        .addStringOption(option => 
            option
                .setName('query')
                .setDescription('The query of the search.')
                .setRequired(true)
                .setMaxLength(128)
        )
    )
    .addSubcommand(command => 
        command
            .setName('leaderboard')
            .setDescription('Leaderboard of the most played on a server.')
        .addStringOption(option =>
            option
                .setName('id')
                .setDescription('The ID of the server.')
                .setRequired(true)
        )
    );

export default ServerInteraction;