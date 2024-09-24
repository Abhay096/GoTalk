import dotenv from 'dotenv';
import dbConnection from "./DB/db.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import registerRouter from './Routes/register.js';
import loginRouter from './Routes/login.js';
import tokenRouter from './Routes/token_data.js';

//configuring env file
dotenv.config({ path: './env' });

//calling  db connection function
dbConnection();

//creating express app
const app = express();

// configuring cors middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,  //allowing cors from this origin
}));

// configuring json middleware
app.use(express.json({ limit: '16kb' }));

// configuring urlencoded middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// configuring cookie parser middleware 
app.use(cookieParser());

// importing routers
app.use('/api', registerRouter)  //using registration route middleware
app.use('/api', loginRouter)  //using login route middleware
app.use('/api', tokenRouter)  //using token route middleware

// creating default route
app.get('/', (req, res) => {
    res.send('hello viewers')
});

//listening to port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});   