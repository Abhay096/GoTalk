import express from 'express';
import { user } from '../Models/user.js';
import jwt from 'jsonwebtoken';


const router = express.Router();
router.get('/connectionFetch', async (req, res) => {
    let userPhone;
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        // Verify the token
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        // Assuming the token contains the phone number  
        userPhone = decoded.phone;
    } catch (error) {
        console.log("Error while getting token!!!", error);
        return res.status(500).json({ message: 'Server error' });
    }

    try {
        const connections = await user.findOne({ phone_no: userPhone }).select('connection');
        return res.status(200).json({ connections: connections });
    } catch (error) {
        console.log("Error while getting connections!!!", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router