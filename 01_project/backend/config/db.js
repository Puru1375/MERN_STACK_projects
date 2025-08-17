import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/notes_pro', {
            useNewUrlParser: true,
            useUnifiedTopology: true
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
}

export default connectDB;
