import express from 'express';
import { profile } from '../Models/profile.js';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

// creating router variable
const router = express.Router();

// creating route for profile
router.post('/profile', async (req, res) => {

    // getting image and bio from user
    const avatar = req.body.avatar;
    const bio = req.body.bio;

    //declaring phone variable
    let phone;

    //getting token from cookies and storing it in variable
    const token = req.cookies.token

    //if don't get the token
    if (!token) {
        console.log("Not get the token!!!")
        return res.status(401).json({ message: 'No token provided', status: 401 });
    }

    // block to verify token
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        phone = decoded.phone;
    } catch (error) {
        console.log("Error in Profile while getting token");
        return res.status(401).json({ message: 'Error in Profile while getting token', status: 401 });
    }

    // block to upload image to cloudinary and storing data in profile
    try {

        //configuring cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        //uploading image on cloudinary
        const uploadResult = await cloudinary.uploader.upload(avatar, { folder: 'GoTalk' });

        //block to update user profile if it pre-exist
        const userExist = await profile.findOne({ phone_no: phone });
        if (userExist) {
            await profile.updateOne({ phone_no: phone }, { $set: { avatar: uploadResult.secure_url, about: bio } });
            return res.status(200).json({ message: 'Profile update successfully', status: 200 });
        }

        //creating the profile and uploading data in database if user is not pre-exist
        await profile.create({
            phone_no: phone,
            avatar: uploadResult.secure_url,
            about: bio
        });
        // returning the response
        return res.status(200).json({ message: 'Profile created successfully', status: 200 });

    } catch (error) {
        // consoling the error
        console.log("Profile Error:", error);
        //returning the error
        return res.status(500).json({ message: 'Error creating profile', status: 500 });
    }
});

export default router;