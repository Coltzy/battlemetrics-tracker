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
            )
            .addStringOption(option =>
                option
                    .setName('country')
                    .setDescription('The ISO country code to filter the servers.')
            )
            .addStringOption(option =>
                option
                    .setName('sort')
                    .setDescription('Sorting option to effect the results.')
                    .addChoices(
                        { name: 'rank', value: 'rank' },
                        { name: 'name', value: 'name' },
                        { name: '-name', value: '-name' },
                        { name: 'players', value: 'players' },
                        { name: '-players', value: '-players' }
                    )
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
            )
    );

export default ServerInteraction;