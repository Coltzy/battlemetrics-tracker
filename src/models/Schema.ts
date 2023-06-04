import mongoose from "mongoose";

export interface IDocument {
    id: string;
    name: string;
    user: string;
}

export default new mongoose.Schema<IDocument>({
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