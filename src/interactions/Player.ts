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
        );

export default PlayerInteraction;