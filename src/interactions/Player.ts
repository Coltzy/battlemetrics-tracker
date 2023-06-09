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
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('list')
            .setDescription('List a group of players by a query.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The query of the player search.')
            )
            .addStringOption(option =>
                option
                    .setName('server')
                    .setDescription('The filter for a server search.')
                    .setAutocomplete(true)
            )
            .addIntegerOption(option =>
                option
                    .setName('limit')
                    .setDescription('The limit of results to fetch.')
                    .setMaxValue(100)
                    .setMinValue(1)
            )
            .addBooleanOption(option =>
                option
                    .setName('online')
                    .setDescription('The filter wether to only return online players.')
            )
    )
    .addSubcommand(command =>
        command
            .setName('servers')
            .setDescription('Lists all the past servers a play has played on.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The ID of the player.')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('identifiers')
            .setDescription('Lists all past identifiers of a player.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The ID of the player.')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
        )
    .addSubcommand(command =>
        command
            .setName('coplay')
            .setDescription('List time spent with other players over the last 24 hours.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The query for the player search.')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addStringOption(option => 
                option
                    .setName('server')
                    .setDescription('The specific server for the coplay.')
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('session')
            .setDescription('List a players previous session history.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The query for the player search.')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addStringOption(option =>
                option
                    .setName('server')
                    .setDescription('The query for a server search to filter the sessions too.')
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('favorite')
            .setDescription('Add a players to your favorite list.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The query for the player to favorite.')
                    .setRequired(true)
                    .setMaxLength(128)
            )
    )
    .addSubcommand(command =>
        command
            .setName('unfavorite')
            .setDescription('Removes a player from your favorite list.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The query for the player to unfavorite.')
                    .setRequired(true)
                    .setMaxLength(128)
                    .setAutocomplete(true)
            )
    );

export default PlayerInteraction;