import dotenv from 'dotenv';
import dbConnection from "./DB/db.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import registerRouter from './Routes/register.js';
import loginRouter from './Routes/login.js';
import tokenRouter from './Routes/token_data.js';
import connectionRouter from './Routes/connection.js';
import profileRouter from './Routes/profile.js';
import profileFetchRouter from './Routes/profile_fetch.js';


//configuring env file
dotenv.config({ path: './env' });

//calling  db connection function
dbConnection();

//creating express app
const app = express();

// configuring cors middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,  //allowing cors from this origin
    credentials: true // This allows cookies to be sent
}));

// configuring json middleware
app.use(express.json({ limit: '5mb' }));

// configuring urlencoded middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// configuring cookie parser middleware 
app.use(cookieParser());

// importing routers
app.use('/api', registerRouter)  //using registration route 
app.use('/api', loginRouter)  //using login route
app.use('/api', tokenRouter)  //using token route
app.use('/api', connectionRouter)  //using connection route
app.use('/api', profileRouter)  //using profile creation route
app.use('/api', profileFetchRouter)  //using profile data fetch route

// creating default route
app.get('/', (req, res) => {
    res.send('hello viewers')
});

//listening to port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});   