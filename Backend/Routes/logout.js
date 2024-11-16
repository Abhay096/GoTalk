import express from 'express';
const router = express.Router();

router.post('/logout', (req, res) => {
    const userPhoneNumber = req.body.userPhoneNumber
    // Clear the token cookie by its name ('token' in this case)
    console.log(userPhoneNumber);
    return 0;
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, // Same options used when setting the cookie
    });

    // Send a response indicating the user has been logged out
    return res.status(200).json({ message: "Logout successful" });
});

export default router;
