import express from 'express';
import { user } from '../Models/user.js';
import bcrypt from 'bcrypt';

//creating router variable
const router = express.Router();

//route for user login
router.post('/login', async (req, res) => {

    // getting the user input
    const userPhoneNo = req.body.phone_no;
    const userPassword = req.body.password;

    try {
        //finding user by phone number
        const userData = await user.findOne({ phone_no: userPhoneNo });

        //if user not found
        if (!userData) {
            return res.json({ message: "Account not found", status: 500 });
        }

        //comparing password with hashed password
        const passwordMatch = await bcrypt.compare(userPassword, userData.password);

        //if password not match
        if (!passwordMatch) {
            return res.json({ message: "Wrong password", status: 500 });
        }
        // if password match
        else {
            //generating session token
            const token = await userData.generateToken();

            //Storing token in cookie
            res.cookie('token', token, {
                httpOnly: true, // The cookie will be inaccessible to JavaScript (X-site scripting)
                secure: true,  // Requires a secure connection (HTTPS) if environment is production 
                sameSite: 'None'
            });

            // returning response
            return res.json({ message: "User logged in successfully", status: 200 });
        }
    } catch (error) {
        //logging error
        console.log("Internal server Error while login:", error);
        //returning error
        return res.status(500).json({ message: "Internal server error", status: 500 });

    }
});

export default router;
