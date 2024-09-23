import dotenv from 'dotenv';
import dbConnection from "./DB/db.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import registerRouter from './Routes/register.js';
import loginRouter from './Routes/login.js';
import tokenRouter from './Routes/token_data.js';

dotenv.config({ path: './env' }) //configuring env file
dbConnection(); //calling  db connection function


const app = express();  //creating express app


app.use(cors({
    origin: process.env.CORS_ORIGIN,  //allowing cors from this origin
    credentials: true // This allows cookies to be sent
})); // configuring cors middleware


app.use(express.json({ limit: '16kb' }));  // configuring json middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  // configuring urlencoded middleware
app.use(cookieParser());  // configuring cookie parser middleware

app.use('/api', registerRouter)  //using registration route middleware
app.use('/api', loginRouter)  //using login route middleware
app.use('/api', tokenRouter)  //using token route middleware


app.get('/', (req, res) => {
    res.send('hello viewers')
});  // creating default route


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});   //listening to port