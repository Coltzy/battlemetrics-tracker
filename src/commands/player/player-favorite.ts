import { CommandInteraction, inlineCode } from 'discord.js';
import Command from '../../Command';
import PlayerModel from '../../models/PlayerModel';

class PlayerFavoriteCommand implements Command {
    public name = 'player-favorite';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('players', query);

        if (!response) {
            await interaction.respond(`No search results were found for the query.`);

            return;
        } 

        const docs = await PlayerModel.find({ user: interaction.user.id });
        
        if (docs.find((doc) => doc.id == response.data.id)) {
            return await interaction.respond('This server is already included in your favorite list.');
        } else if (docs.length >= 25) {
            return await interaction.respond('You can only have 25 servers added to your favorite list.');
        }

        const model = new PlayerModel({
            id: response.data.id,
            name: response.data.attributes.name || '',
            user: interaction.user.id
        });

        await model.save();

        await interaction.respond(`Player ${inlineCode(response.data.attributes.name)} has been saved to your favorite list.`);
    }
}

export default PlayerFavoriteCommand;