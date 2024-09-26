import express from 'express';
import { profile } from '../Models/profile.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.post('/profile_fetch', async (req, res) => {

    const friendPhone = req.body.phone;
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    //if token not found
    if (!token) {
        console.log("Not get the token!!!")
        return res.status(401).json({ message: 'No token provided' });
    }
    if (!friendPhone) {

        try {
            // Verify the token
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
            // Assuming the token contains the phone number  
            const userPhone = decoded.phone;

            const userProfile = await profile.findOne({ phone_no: `${userPhone}` });

            return res.status(200).json({ userProfile: userProfile });

        } catch (error) {
            console.log("Server error file fetching user profile:", error);
            return res.status(500).json({ message: 'Server Error' });
        }
    }
    else {
        try {
            const userProfile = await profile.findOne({ phone_no: `${friendPhone}` });
            return res.status(200).json({ userProfile: userProfile });
        } catch (error) {
            console.log("Server error file fetching friend profile:", error);
            return res.status(500).json({ message: 'Server Error' });
        }
    }
})

export default router;