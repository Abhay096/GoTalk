import express from 'express';
import { user } from '../Models/user.js';

//  Create a router variable
const router = express.Router();

//   Define route
router.patch('/connectionRequest', async (req, res) => {

    //    Get the credentials from the request body
    const { userPhone, friendPhone } = req.body;
    const friendName = req.body.name || "";

    // Check if the friend using GoTalk
    try {

        // Finding the friend using GoTalk
        const friendUseApp = await user.findOne({ phone_no: friendPhone });

        // If friend not using GoTalk then returning message
        if (!friendUseApp) {
            return res.status(200).json({ 'message': "This user don't use this application" })
        }

    } catch (error) {
        // consoling the error
        console.log("Server Error while validating the user", error);
        //  If server error occurs then returning error message
        res.status(500).json({ 'message': "Server Error while validating the user" });
    }

    // Making the connection
    try {
        // checking if the user already sent a request to the friend
        const friendExist = await user.findOne({ phone_no: userPhone, "connection.key": friendPhone }, { "connection.$": 1 })

        // if sent then return the message
        if (friendExist) {
            return res.status(200).json({ "message": "User already added" });
        }

        //if not then connect the user with friend
        await user.updateOne({ phone_no: userPhone }, { $push: { connection: { key: friendPhone, value: friendName } } });

        // return the message for successfull connection
        return res.status(200).json({ "message": "User added successfully" })

    } catch (error) {
        //consoling the server error
        console.log("Server error while adding user:", error)
        // return the server error message
        return res.status(500).json({ "message": "Server error while adding user" })
    }
});

export default router;
