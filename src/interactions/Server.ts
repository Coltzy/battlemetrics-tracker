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
                .setName('query')
                .setDescription('The query of the leaderboard search.')
                .setRequired(true)
                .setMaxLength(128)
        )
    )
    .addSubcommand(command =>
        command
            .setName('isonline')
            .setDescription('Checks to see if the player entered is online.')
        .addStringOption(option =>
            option
                .setName('server')
                .setDescription('The query for the server to check for.')
                .setRequired(true)
                .setMaxLength(128)
        )
        .addStringOption(option =>
            option
                .setName('player')
                .setDescription('The name of the player to check for.')
                .setRequired(true)
                .setMaxLength(32)
        )
    );

export default ServerInteraction;