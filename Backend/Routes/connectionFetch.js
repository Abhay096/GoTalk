import express from 'express';
import { user } from '../Models/user.js';
import jwt from 'jsonwebtoken';

//  Create a router variable
const router = express.Router();
router.get('/connectionFetch', async (req, res) => {

    // variable to store phone number
    let userPhone;

    //block to get phone number from token
    try {
        // Fetching token from cookies
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        // Verify the token
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        // token contains the phone number  
        userPhone = decoded.phone;
    } catch (error) {
        // consoling the token error
        console.log("Error while getting token!!!", error);
        // returning the token error
        return res.status(500).json({ message: 'Server error' });
    }

    // block to fetch connection data from database
    try {
        // fetching connection data from database
        const connections = await user.findOne({ phone_no: userPhone }).select('connection');
        // returning the connection data
        return res.status(200).json({ connections: connections });
    } catch (error) {
        // consoling the fetching error
        console.log("Error while getting connections!!!", error);
        // returning the fetching error
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router