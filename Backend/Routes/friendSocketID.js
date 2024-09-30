import { user } from "../Models/user.js";
import express from "express";

const router = express.Router();

router.post('/friendSocketId', async (req, res) => {
    const friendPhone = req.body.phone;
    try {
        const socketId = await user.findOne({ phone_no: friendPhone }).select('socketId')
        return res.status(200).json({ friendSocketId: socketId.socketId })
    } catch (error) {
        console.log('Error while fetching socket id of friend');
        return res.status(500).json({ message: 'Error while connecting to friend' });
    }
});

export default router;

