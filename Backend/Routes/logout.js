import express from 'express';
import jwt from 'jsonwebtoken';
import { updateSocketId } from '../utils/updateSocketId.js';

const router = express.Router();

router.post('/logout', (req, res) => {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    //if token not found
    if (!token) {
        console.log("this is the token--->", token);
        console.log("Not get the token!!!")
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        // Assuming the token contains the phone number  
        const userPhone = decoded.phone;
        updateSocketId(userPhone);
        console.log("socket id is now ''");
    } catch (error) {
        console.log("error while loging out", error);
    }

    // Clear the token cookie by its name ('token' in this case)
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, // Same options used when setting the cookie
    });

    // Send a response indicating the user has been logged out
    return res.status(200).json({ message: "Logout successful" });
});

export default router;
