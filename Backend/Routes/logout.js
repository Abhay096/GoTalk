import express from 'express';
const router = express.Router();

router.post('/logout', (req, res) => {
    // Clear the token cookie by its name ('token' in this case)
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, // Same options used when setting the cookie
    });

    // Send a response indicating the user has been logged out
    return res.status(200).json({ message: "Logout successful" });
});

export default router;
