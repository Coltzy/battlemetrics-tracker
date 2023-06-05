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
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('list')
            .setDescription('List a group of servers by a query.')
            .addStringOption(option =>
               option
                    .setName('query')
                    .setDescription('The query of the server search.')
            )
            .addStringOption(option =>
                option
                    .setName('game')
                    .setDescription('The game name to filter the servers.')
                    .setAutocomplete(true)
            )
            .addStringOption(option =>
                option
                    .setName('country')
                    .setDescription('The ISO country code to filter the servers.')
                    .setAutocomplete(true)
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
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('players')
            .setDescription('Shows a list of all online players on a server.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The query for the server to list.')
                    .setRequired(true)
                    .setMaxLength(128)
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('favorite')
            .setDescription('Add a server to your favorite list.')
            .addStringOption(option =>
                    option
                        .setName('query')
                        .setDescription('The query for the server to favorite.')
                        .setRequired(true)
                        .setMaxLength(128)
            )
    )
    .addSubcommand(command =>
        command
            .setName('unfavorite')
            .setDescription('Removes a server from your favorite list.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The query for the server to unfavorite.')
                    .setRequired(true)
                    .setMaxLength(128)
                    .setAutocomplete(true)
            )
    );

export default ServerInteraction;