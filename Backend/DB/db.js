import mongoose from 'mongoose';

const dbConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`, { dbName: 'ChattingDB' });
        console.log('DB Connected');
    } catch (error) {
        console.log('Error connecting to DB:', error);
    }
};

export default dbConnection;
