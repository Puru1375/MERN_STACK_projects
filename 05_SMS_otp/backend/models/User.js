import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,  // ⚠️ for real app: hash with bcrypt
  verified: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);
