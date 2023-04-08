import mongoose from 'mongoose';
import Logger from '../Logger';
import 'dotenv/config';

class Mongo {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public connect() {
        mongoose.connect(process.env.MONGO_URI as string);
        Logger.info('Mongo has been connected!');
    }
}

export default Mongo;