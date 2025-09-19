import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Step 1: Send OTP
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ status: verification.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Step 2: Verify OTP & Register
app.post("/verify-otp", async (req, res) => {
  const { name, email, password, phone, code } = req.body;

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });

    if (check.status === "approved") {
      const user = new User({ name, email, phone, password, verified: true });
      await user.save();
      return res.json({ verified: true, user });
    }
    res.status(400).json({ verified: false, status: check.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
