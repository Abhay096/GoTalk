import express from 'express';
import { user } from '../Models/user.js';
import bcrypt from 'bcrypt';

const router = express.Router(); //creating router variable
router.post('/login', async (req, res) => {
    const userPhoneNo = req.body.phone_no;  //getting phone number from request body
    const userPassword = req.body.password;   //getting password from request body

    try {
        const userData = await user.findOne({ phone_no: userPhoneNo });  //finding user by phone number

        if (!userData) {
            return res.json({ message: "Account not found", status: 0 });   //if user not found
        }

        const passwordMatch = await bcrypt.compare(userPassword, userData.password);   //comparing password with hashed password

        if (!passwordMatch) {
            return res.json({ message: "Wrong password", status: 0 });    //if password not match
        }
        else {
            const token = await userData.generateToken();  //generating session token

            res.cookie('token', token, {
                httpOnly: true, // The cookie will be inaccessible to JavaScript
                secure: true  // Requires a secure connection (HTTPS)
            }); //Storing token in cookie

            return res.json({ message: "User logged in successfully", status: 1, token });   //returning token
        }
    } catch (error) {
        console.log("Internal server Error while login:", error);  //logging error
        return res.status(500).json({ message: "Internal server error", status: 0 }); //returning error

    }
}); //route for user login

export default router;
