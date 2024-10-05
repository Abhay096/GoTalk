import express from 'express';
import { user } from '../Models/user.js';

//creating router variable
const router = express.Router();

// route for user registration
router.post('/register', async (req, res) => {
    const userPhoneNo = req.body.phone_no;

    try {

        //find user by phone number
        const userData = await user.findOne({ phone_no: userPhoneNo });

        //checking user pre-exist or not
        if (userData) {
            return res.status(400).json({ message: "User already exists", status: 400 });
        };

        //if user is not pre-exist then creating new user
        await user.create({
            name: req.body.name,
            email: req.body.email,
            phone_no: req.body.phone_no,
            password: req.body.password
        });
        //returning success message
        res.status(200).json({ message: "User created successfully", status: 200 });

    } catch (error) {
        //consoling error
        console.log("Server Error while registering:", error);
        //returning error message 
        res.status(500).json({ message: "Internal server error", status: 500 });

    }
});

export default router;