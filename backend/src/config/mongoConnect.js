import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;

const mongoConnect = async () => {
    try{
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB with Mongoose');
    }
    catch(err){
        console.error('❌ MongoDB connection error:', err);
    }
}
export default mongoConnect;