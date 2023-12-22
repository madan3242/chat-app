import mongoose from "mongoose"

export const connectdb = async () => {
    try {
        mongoose.set("strictQuery", true);
        const connectionInstance = await mongoose.connect(
          `${process.env.MONGO_URI}/${process.env.DB_NAME}`
        );        
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(error);
    }
}