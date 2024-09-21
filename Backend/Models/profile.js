import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    avatar: {
        type: String,
    },
    about: {
        type: String,
        required: true,
        maxlength: 50,
    }
}, { timestamps: true });

export const profile = mongoose.model('Profile', profileSchema);