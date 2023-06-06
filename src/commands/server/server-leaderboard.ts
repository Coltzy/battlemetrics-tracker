import { CommandInteraction, inlineCode } from 'discord.js';
import Autocomplete from '../../autocompletes/idocument-autocomplete';
import ServerLeaderboardBuilder from '../../builders/server/server-leaderboard-builder';
import Util from '../../Util';
import PaginationBuilder from '../../builders/PaginationBuilder';

class ServerLeaderboardCommand extends Autocomplete {
    public name = 'server-leaderboard';

    public constructor() {
        super('servers', 'query');
    }

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const period = 'AT';
        const response = await interaction.client.BMF.get('servers', query);

        if (!response) {
            return await interaction.respond(`No search results were found for the query.`);
        } 

        const { id } = response.data.relationships.game.data;
        if (!Util.serverHasPlayerList(id)) {
            return await interaction.respond(`The server type ${inlineCode(id)} does not support player lists.`);
        }

        const uri = interaction.client.BMF.uri(`servers/${response.data.id}/relationships/leaderboards/time`, {
            'filter[period]': period,
            'page[size]': '100'
        });

        const res = await interaction.client.BMF.direct_fetch(uri);

        if (!res || !res.data?.length) {
            return await interaction.respond('There was an issue when fetching the leaderboard information.');
        }

        const builder = new ServerLeaderboardBuilder(response);
        const slides = builder.build(res);

        new PaginationBuilder(interaction, slides, res.links, builder);
    }
}

export default ServerLeaderboardCommand;