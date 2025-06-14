import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://user1:user123456@cluster.kdokm1c.mongodb.net/homestaydb?retryWrites=true&w=majority");
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error(`MongoDB connection FAIL: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
