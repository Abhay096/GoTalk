import dotenv from 'dotenv';
import dbConnection from "./DB/db.js";


dotenv.config({ path: './env' })
dbConnection();