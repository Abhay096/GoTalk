import { user } from "../Models/user.js";

export const updateSocketId = async (userID, socketId) => {
    try {
        await user.updateOne({ phone_no: userID }, { $set: { socketId: socketId } })
        console.log('socket id updated succefully');
    } catch (error) {
        console.log('Error while updating socket id', error);
    }
}