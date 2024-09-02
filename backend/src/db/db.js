import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { User } from "../models/user.model.js";

const connectDB = async () => {
    try {
        console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n yesssss hurrah MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        const entries = await User.find();
        console.log(entries);
    } catch (error) {
        console.log("MONGODB has connection FAILED error", error);
        process.exit(1)
    }
}

export default connectDB