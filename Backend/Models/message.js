import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderSocketID: {
        type: String,
    },
    receiverSocketID: {
        type: String,
    },
    senderUserID: {
        type: String,
    },
    receiverUserID: {
        type: String,
    },
    message: {
        type: String,
    }
}, { timestamps: true });

export const messageData = mongoose.model("Message", messageSchema);