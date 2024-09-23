import express from 'express';

const router = express.Router();

router.get('/token_data', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        console.log("Not get the token!!!")
        return res.status(401).json({ message: 'No token provided' });
    } //Checking if get the token or not

    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);  // Verify the token
        const userPhone = decoded.phone;  // Assuming the token contains the email

        // Fetch user data from the database using the email from the token
        const user = await user.findOne({ phone_no: userPhone });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send relevant user information back to the client
        return res.json({ phone: user.phone_no });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
});