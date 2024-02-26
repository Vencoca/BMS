import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_user}:${process.env.MONGODB_password}@bmsdata.t8setyd.mongodb.net/Frontend?retryWrites=true&w=majority`);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};