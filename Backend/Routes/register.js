import express from 'express';
import { user } from '../Models/user.js';

const router = express.Router(); //creating router variable
router.post('/register', async (req, res) => {
    const userPhoneNo = req.body.phone_no;

    try {
        const userData = await user.findOne({ phone_no: userPhoneNo });  //find user by phone number
        if (userData) {
            return res.status(400).json({ message: "User already exists" });
        }; //checking user pre-exist or not
        await user.create({
            name: req.body.name,
            email: req.body.email,
            phone_no: req.body.phone_no,
            password: req.body.password
        });  //creating new user
        res.status(200).json({ message: "User created successfully" });  //returning success message

    } catch (error) {
        console.log("Server Error while registering:", error); //consoling error
        res.status(500).json({ message: "Internal server error" });  //returning error message

    }
}); // route for user registration


export default router;