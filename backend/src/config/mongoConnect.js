import mongoose from "mongoose";

const mongoURI = process.env.MONGODB;

const mongoConnect = async () => {
    try{
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`, '✅ Connected to MongoDB with Mongoose');
    }
    catch(err){
        console.error('❌ MongoDB connection error:', err);
    }
}
export default mongoConnect;