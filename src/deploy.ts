import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Logger from './Logger';
import 'dotenv/config';

import { 
    PingInteraction
} from './interactions/Ping';

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

try {
    rest.put(
        Routes.applicationCommands(
            process.env.CLIENT_ID as string
        ), 
        {
            body: [
                PingInteraction
            ],
        }
    );

    Logger.info('Successfully reloaded interaction (/) commands.');
} catch (err) {
    console.error(err);
}