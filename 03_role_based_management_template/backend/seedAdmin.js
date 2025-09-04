import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";

await connectDB();

dotenv.config();



async function seed() {
  const email = "admin@gmail.com";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin exists:", exists.email);
    process.exit(0);
  }
  const hashed = await bcrypt.hash("admin123", 10);
  const admin = await User.create({ name: "Admin", email, password: hashed, role: "admin", isVerified: true });
  console.log("Created admin:", admin.email);
  process.exit(0);
}

seed();
