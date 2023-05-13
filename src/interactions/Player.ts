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
    )
    .addSubcommand(command =>
        command
            .setName('list')
            .setDescription('List a group of players by a query.')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('The query of the player search.')
                    .setRequired(true)
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
            )
        )
    .addSubcommand(command =>
        command
            .setName('coplay')
            .setDescription('List time spent with other players over the last 24 hours.')
            .addStringOption(option =>
                option
                    .setName('player')
                    .setDescription('The query for the player search.')
                    .setRequired(true)
            )
            .addStringOption(option => 
                option
                    .setName('server')
                    .setDescription('The specific server for the coplay.')
            )
    );

export default PlayerInteraction;