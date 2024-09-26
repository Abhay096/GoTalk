import express from 'express';
import { profile } from '../Models/profile.js';
import jwt from 'jsonwebtoken';

//creting the router variable
const router = express.Router();

// route to fetch profiles
router.post('/profile_fetch', async (req, res) => {

    //getting phone number from the request body
    const friendPhone = req.body.phone;

    // getting token from cookies or header
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    //if token not found
    if (!token) {
        console.log("Not get the token!!!")
        return res.status(401).json({ message: 'No token provided' });
    }

    // this is to fetch profile of user
    if (!friendPhone) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
            // Assuming the token contains the phone number  
            const userPhone = decoded.phone;
            //  Fetching the profile of the user
            const userProfile = await profile.findOne({ phone_no: `${userPhone}` });
            //  sending the profile as response
            return res.status(200).json({ userProfile: userProfile });

        } catch (error) {
            // consoling the error
            console.log("Server error file fetching user profile:", error);
            // returning the error
            return res.status(500).json({ message: 'Server Error' });
        }
    }

    // this is to fetch profile of user's friends
    else {
        try {
            // fetching profile of user's friends
            const userProfile = await profile.findOne({ phone_no: `${friendPhone}` });
            //returning the profile
            return res.status(200).json({ userProfile: userProfile });
        } catch (error) {
            //consoling the error
            console.log("Server error file fetching friend profile:", error);
            //returning the error
            return res.status(500).json({ message: 'Server Error' });
        }
    }
})

export default router;