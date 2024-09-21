import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phone_no: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    password: {
        type: String,
        required: true
    },
    connection: {
        type: [
            {
                key: { type: String, }, // This is for phone number
                value: { type: String, } // This is for name
            }
        ],
    }
}, { timestamps: true });

export const user = mongoose.model("User", userSchema);