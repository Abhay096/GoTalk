import express from 'express';
import { messageData } from '../Models/message.js';

const router = express.Router();

router.post('/latestMessageFetch', async (req, res) => {
    const userPhone = req.body.userPhone;
    const friendPhone = req.body.friendPhone;

    try {
        const response = await messageData.find({
            $or: [
                { $and: [{ senderUserID: userPhone }, { receiverUserID: friendPhone }] },
                { $and: [{ senderUserID: friendPhone }, { receiverUserID: userPhone }] }
            ]
        }).sort({ createdAt: -1 })
        return res.status(200).json({ data: response[0] })
    } catch (error) {
        console.log("Error while fetching messages", error);
        return res.status(500).json({ message: "Error while loading messages" });
    }
});

export default router;