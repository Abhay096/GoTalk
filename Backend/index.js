import dotenv from 'dotenv';
import dbConnection from "./DB/db.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { tokenFromCookies } from './utils/cookieSocket.js';
import { updateSocketId } from './utils/updateSocketId.js';

import registerRouter from './Routes/register.js';
import loginRouter from './Routes/login.js';
import tokenRouter from './Routes/token_data.js';
import connectionRouter from './Routes/connection.js';
import profileRouter from './Routes/profile.js';
import profileFetchRouter from './Routes/profile_fetch.js';
import connectionFetchRouter from './Routes/connectionFetch.js'
import sockedIDRouter from './Routes/friendSocketID.js'
import { messageData } from './Models/message.js';
import chatFetchRouter from './Routes/chatFetch.js';
import latestMessageFetchRouter from './Routes/latestMessageFetch.js';


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

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    },
    connectionStateRecovery: {}
});
io.on("connection", async (socket) => {
    console.log(socket.id);
    let userPhone;
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
        const token = tokenFromCookies(cookies);

        if (token) {
            // Verify the token
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
            // Assuming the token contains the phone number  
            userPhone = decoded.phone;
            updateSocketId(userPhone, socket.id)
        }
    }

    socket.on('send', async (data) => {
        const { friendSocketId, friendPhoneNumber, message } = data;
        const newMessage = new messageData({
            senderSocketID: socket.id,
            receiverSocketID: friendSocketId,
            senderUserID: userPhone,
            receiverUserID: friendPhoneNumber,
            message: message
        });
        await newMessage.save();

        socket.to(friendSocketId).emit('receive', { message: message });
    })

    socket.on('disconnect', () => {
        console.log("User disconnectd", socket.id);
    })
})

// importing routers
app.use('/api', registerRouter)  //using registration route 
app.use('/api', loginRouter)  //using login route
app.use('/api', tokenRouter)  //using token route
app.use('/api', connectionRouter)  //using connection route
app.use('/api', profileRouter)  //using profile creation route
app.use('/api', profileFetchRouter)  //using profile data fetch route
app.use('/api', connectionFetchRouter)  //using profile data fetch route
app.use('/api', sockedIDRouter)  //route use to fetch socket id of friend
app.use('/api', chatFetchRouter)  //route use to fetch messages from db
app.use('/api', latestMessageFetchRouter)  //route use to fetch latest messages from db

// creating default route
app.get('/', (req, res) => {
    res.send('hello viewers')
});

// listening to port
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });   