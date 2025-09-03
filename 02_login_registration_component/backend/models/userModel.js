import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false, 
  },

  otp: {
    type: String, 
  },

  otpExpires: {
    type: Date,
  },
});

const User = model("User", userSchema);

export default User;
