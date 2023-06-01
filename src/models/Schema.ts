import mongoose from "mongoose";

export default new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});