

import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config({ quiet: true })

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successfully") 
    } catch (error) {
        console.error("Mongodb connection failed: ", error.message)
        process.exit(1)
    }
}

export default connectDB;
