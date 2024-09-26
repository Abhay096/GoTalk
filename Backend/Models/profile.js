import mongoose from "mongoose";

//********************Defining Profile schema ********************
const profileSchema = new mongoose.Schema({
    phone_no: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
    },
    about: {
        type: String,
        required: true,
        maxlength: 200,
    }
}, { timestamps: true });

export const profile = mongoose.model('Profile', profileSchema);