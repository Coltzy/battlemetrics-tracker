import { Client, CommandInteraction, inlineCode } from 'discord.js';
import Command from '../../Command';
import { ServerLeaderboard } from '../../types/servers';
import RustServerLeaderboardBuilder from '../../builders/leaderboard/rust-leaderboard';
import LeaderboardModel from '../../models/Leaderboard';
import { ServerLeaderboardMongoModel } from '../../types/Models';
import { BMErrors } from '../../types/BMError';
import moment from 'moment';

class ServerLeaderboardCommand implements Command {
    public name = 'server-leaderboard';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const id = interaction.options.get('id')?.value as string;
        const period = 'AT';

        const models = await LeaderboardModel.find({ server: id });
        const days = moment().diff(moment(models[0]?.createdAt), 'hours');

        if (models.length == 0 || days >= 24) {
            interaction.reply({
                content: 'Fetching leaderboard information this may take a few seconds...',
                fetchReply: true
            });

            const response = await this.fetch(interaction.client, id, period);

            if (response && 'errors' in response) {
                if (response.errors[0].title == 'Unknown Server') {
                    interaction.reply(`Server ID ${inlineCode(id)} doesn't exist.`);
                } else {
                    interaction.reply('There was an unexpected error when running this command!');
                }
            } else {
                await this.execute(interaction);
            }

            return;
        }

        new RustServerLeaderboardBuilder(interaction, models);
    }

    private async fetch(client: Client, id: string, period: string): Promise<BMErrors | void> {
        await LeaderboardModel.deleteMany({ server: id });
        const docs: ServerLeaderboardMongoModel[] = [];

        let uri: string;

        uri = client.BMF.uri('servers/{ID}/relationships/leaderboards/time', id, {
            'filter[period]': period,
            'page[size]': '100'
        });

        for (let i = 0; i < 10; i++) {
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
    }
}

export default ServerLeaderboardCommand;