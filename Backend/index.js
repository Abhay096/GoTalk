import dotenv from 'dotenv';
import dbConnection from "./DB/db.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config({ path: './env' })
dbConnection();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('hello viewers')
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})