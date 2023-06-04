import { Client } from 'discord.js';
import mongoose from 'mongoose';
import PlayerModel from '../models/PlayerModel';
import ServerModel from '../models/ServerModel';
import Logger from '../Logger';
import 'dotenv/config';

class Mongo {
    constructor(client: Client) {
        PlayerModel.find().then((data) => data.map((player) => client.players.set(player.user, player)));
        ServerModel.find().then((data) => data.map((server) => client.servers.set(server.user, server)));
    }

    public connect() {
        mongoose.connect(process.env.MONGO_URI as string);
        Logger.info('Mongo has been connected!');
    }
}

export default Mongo;