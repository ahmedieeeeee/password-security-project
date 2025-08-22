import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URL;
  if (!uri) throw new Error("MONGO_URL missing");
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
