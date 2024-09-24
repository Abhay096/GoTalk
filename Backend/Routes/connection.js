import express from 'express';
import { user } from '../Models/user.js';

const router = express.Router();
router.patch('/connectionRequest', async (req, res) => {
    const { userPhone, friendPhone } = req.body;
    const friendName = req.body.name || "";

    try {
        const friendUseApp = await user.findOne({ phone_no: friendPhone });
        if (!friendUseApp) {
            return res.status(200).json({ 'message': "This user don't use this application" })
        }
    } catch (error) {
        console.log("Server Error while validating the user", error);
        res.status(500).json({ 'message': "Server Error while validating the user" });
    }

    try {
        const friendExist = await user.findOne({ phone_no: userPhone, "connection.key": friendPhone }, { "connection.$": 1 })

        if (friendExist) {
            return res.status(200).json({ "message": "User already added" });
        }

        await user.updateOne({ phone_no: userPhone }, { $push: { connection: { key: friendPhone, value: friendName } } });

        return res.status(200).json({ "message": "User added successfully" })
    } catch (error) {
        console.log("Server error while adding user:", error)
        return res.status(500).json({ "message": "Server error while adding user" })
    }
});

export default router;
