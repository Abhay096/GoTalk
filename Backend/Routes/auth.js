import express from 'express';

const router = express.Router();

router.get('/auth', async (req, res) => {
    //  getting token from cookies
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    //if token not found
    if (!token) {
        console.log("Not get the token!!!")
        return res.status(200).json({ authenticated: false });
    }
    return res.status(200).json({ authenticated: true });
});

export default router;