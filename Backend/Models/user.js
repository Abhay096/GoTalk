import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//********************Defining user schema ********************
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });


//*************************password encrypting*********************
//pre is mongodb db hook which tells before saving do this and don't use arrow function because that will not take this reference
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10)
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


//*************************Generate session token*********************
userSchema.methods.generateToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id, email: this.phone_no }, process.env.JWT_SECRET);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log("jwt error:", error);
    }
}

export const user = mongoose.model("User", userSchema);