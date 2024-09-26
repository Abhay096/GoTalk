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
        return res.status(401).json({ message: 'No token provided' });
    }

    // block to verify token
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        phone = decoded.phone;
    } catch (error) {
        console.log("Error in Profile while getting token");
        return res.status(401).json({ message: 'Error in Profile while getting token' });
    }

    // block to upload image to cloudinary and storing data in profile
    try {

        //configuring cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        // const avatarData = avatar.replace(/^data:image\/[a-z]+;base64,/, "");
        //uploading image on cloudinary
        const uploadResult = await cloudinary.uploader.upload(avatar, { folder: 'GoTalk' });

        const userExist = await profile.findOne({ phone_no: phone });
        if (userExist) {
            await profile.updateOne({ phone_no: phone }, { $set: { avatar: uploadResult.secure_url, about: bio } });
            return res.status(200).json({ message: 'Profile update successfully' });
        }

        //uploading data in database
        await profile.create({
            phone_no: phone,
            avatar: uploadResult.secure_url,
            about: bio
        })
        return res.status(200).json({ message: 'Profile created successfully' });

    } catch (error) {
        console.log("Profile Error:", error);
        return res.status(500).json({ message: 'Error creating profile' });
    }
});

export default router;