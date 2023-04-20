import { Client, CommandInteraction, inlineCode } from 'discord.js';
import Command from '../../Command';
import { ServerLeaderboard } from '../../types/servers';
import LeaderboardModel from '../../models/Leaderboard';
import { ServerLeaderboardMongoModel } from '../../types/Models';
import { BMErrors } from '../../types/BMError';
import ServerLeaderboardBuilder from '../../builders/leaderboard/leaderboard';
import Util from '../../Util';
import Logger from '../../Logger';

class ServerLeaderboardCommand implements Command {
    public name = 'server-leaderboard';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const period = 'AT';
        let response;

        try {
            response = await Util.searchServer(interaction.client, query);
        } catch (err) {
            Logger.error('There was an error when fetching from battlemetrics.');
            console.error(err);

            interaction.reply('There was an error when fetching this data.');
            return;
        }

        

        if (!response) {
            await interaction.reply(`No search results were found for ${inlineCode(query)}`);

            return;
        } 

        const { id } = response.data.relationships.game.data;
        if (!this.isValidServer(id)) {
            await interaction.reply(`The server type ${inlineCode(id)} does not support player lists.`);

            return;
        }

        const docs = await LeaderboardModel.find({ server: response.data.id });
        const { data: server } = response;

        if (!docs.length) {
            interaction.reply({
                content: 'Fetching leaderboard information this may take a few seconds...',
                fetchReply: true
            });

            const leaderboard = await this.fetch(interaction.client, response.data.id, period);

            if ('errors' in leaderboard) {
                interaction.editReply('There was an unexpected error when running this command!');
            } else {
                new ServerLeaderboardBuilder(interaction, server, leaderboard);
            }

            return;
        }

        new ServerLeaderboardBuilder(interaction, server, docs);
    }

    private async fetch(client: Client, id: string, period: string) {
        await LeaderboardModel.deleteMany({ server: id });
        const docs: ServerLeaderboardMongoModel[] = [];

        let uri: string;

        uri = client.BMF.uri(`servers/${id}/relationships/leaderboards/time`, {
            'filter[period]': period,
            'page[size]': '100'
        });

        for (let i = 0; i < 10; i++) {
            if (!uri) break;
            const data = await client.BMF.direct_fetch(uri) as BMErrors | ServerLeaderboard;

            if ('errors' in data) {
                return data;
            }

            uri = data.links.next as string;
            for (const player of data.data) {
                const doc = new LeaderboardModel({
                    server: id,
                    id: player.id,
                    name: player.attributes.name,
                    value: player.attributes.value,
                    rank: player.attributes.rank
                });

                docs.push(doc);
            }
        }

        await LeaderboardModel.insertMany(docs);

        return docs;
    }

    private isValidServer(type: string) {
        return [
            'csgo',
            'rust',
            'ark',
            'gmod',
            'squad',
            'cs',
            'tf2',
            'hll',
            'arma3',
            'unturned',
            'zomboid',
            'css',
            'vrising',
            'rs2vietnam',
            'sandstorm',
            'postscriptum',
            'btw',
        ].includes(type);
    }
}

export default ServerLeaderboardCommand;