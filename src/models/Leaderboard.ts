import mongoose from 'mongoose';

export default mongoose.model(
    'leaderboard_players',
    new mongoose.Schema({
        server: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true,
        },
        rank: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 60 * 24
        }
    })
);