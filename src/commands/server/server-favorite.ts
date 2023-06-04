import { CommandInteraction, inlineCode } from 'discord.js';
import Command from '../../Command';
import ServerModel from '../../models/ServerModel';

class ServerFavoriteCommand implements Command {
    public name = 'server-favorite';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('servers', query);

        if (!response) {
            await interaction.respond(`No search results were found for the query.`);

            return;
        } 

        const doc = interaction.client.servers.get(interaction.user.id);
        const { id, name } = response.data.attributes;
        
        if (doc?.find((doc) => doc.id == id)) {
            return await interaction.respond('This server is already included in your favorite list.');
        } else if (doc && doc.length >= 25) {
            return await interaction.respond('You can only have 25 servers added to your favorite list.');
        }

        const { user } = interaction;

        const model = new ServerModel({ user: user.id, name,id });
        const saved = await model.save();

        interaction.client.servers.set(user.id, saved);

        await interaction.respond(`Server ${inlineCode(response.data.attributes.name)} has been saved to your favorite list.`);
    }
}

export default ServerFavoriteCommand;