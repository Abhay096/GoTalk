import mongoose from 'mongoose';

// function Connect to the database
const dbConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`, { dbName: 'ChattingDB' });
        console.log('DB Connected');
    } catch (error) {
        console.log('Error connecting to DB:', error);
    }
};

export default dbConnection;
