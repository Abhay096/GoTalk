import dotenv from 'dotenv';
import dbConnection from "./DB/db.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './Routes/register.js';

dotenv.config({ path: './env' }) //configuring env file
dbConnection(); //calling  db connection function


const app = express();  //creating express app


app.use(cors({
    origin: process.env.CORS_ORIGIN,
})); // configuring cors middleware


app.use(express.json({ limit: '16kb' }));  // configuring json middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  // configuring urlencoded middleware
app.use(cookieParser());  // configuring cookie parser middleware

app.use('/api', router)  //using registration route middleware


app.get('/', (req, res) => {
    res.send('hello viewers')
});  // creating default route


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});   //listening to port