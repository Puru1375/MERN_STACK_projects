
import dotenv from "dotenv";
import User from "./models/UserModel.js";
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";

await connectDB();

dotenv.config();

async function seed() {
  const email = "itcompany@gmail.com";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin exists:", exists.email);
    process.exit(0);
  }
  const hashed = await bcrypt.hash("1234567890", 10);
  const admin = await User.create({ name: "IT_company", email, password: hashed, role: "company", isVerified: true });
  console.log("Created admin:", admin.email);
  process.exit(0);
}

seed();