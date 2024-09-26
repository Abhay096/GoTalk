import express from 'express';
import jwt from 'jsonwebtoken';
import { user } from '../Models/user.js';

// creating router variable
const router = express.Router();

router.get('/token_data', async (req, res) => {

    //  getting token from cookies
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    //if token not found
    if (!token) {
        console.log("Not get the token!!!")
        return res.status(401).json({ message: 'No token provided' });
    }

    //  if token found
    try {
        // Verify the token
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        // Assuming the token contains the phone number  
        const userPhone = decoded.phone;

        // Fetch user data from the database using the phone number from the token
        const account = await user.findOne({ phone_no: `${userPhone}` }).select('-password -tokens');

        //if user not found
        if (!account) {
            return res.status(404).json({ message: 'User not found' });
        }

        //if user found Send relevant user information back to the client
        // return res.json({ phone: account.phone_no });
        return res.json({ account: account });

    } catch (err) {
        // consoling error
        console.error(err);
        //  return error message
        return res.status(403).json({ message: 'Invalid token' });
    }
});

export default router;