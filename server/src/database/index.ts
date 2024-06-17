import mongoose from "mongoose";

const connectdb = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );
    console.log(`DATABASE CONNECTED`);
  } catch (error) {
    console.error(error);
  }
};

export default connectdb;
