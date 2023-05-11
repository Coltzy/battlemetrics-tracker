import { CommandInteraction, inlineCode } from 'discord.js';
import Command from '../../Command';
import Util from '../../Util';
import { PlayerWithServerMeta } from '../../types/players';
import PlayerServersBuilder from '../../builders/player/builder-player-servers';

class PlayerServersCommand implements Command {
    public name = 'player-servers';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public constructor() {}

    public async execute(interaction: CommandInteraction) {
        const query = interaction.options.get('query')?.value as string;
        const response = await interaction.client.BMF.get('players', query);

        if (!response) {
            await Util.reply(interaction, `No search results were found for ${inlineCode(query)}`);

            return;
        }

        const res = await interaction.client.BMF.fetch(`players/${response.data.id}`, {
            'include': 'server'
        });

        if (!res) {
            await Util.reply(interaction, 'There seems to have been an issue executing this command.');
        } else if (!res.included.length) {
            await Util.reply(interaction, 'This player has no previous servers.');
        } else {
            new PlayerServersBuilder(interaction, res as PlayerWithServerMeta);
        }
    }
}

export default PlayerServersCommand;