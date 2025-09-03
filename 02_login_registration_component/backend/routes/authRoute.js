
import express from "express";
import { registerUser, loginUser, verifyOTP} from "../controller/authController.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

export default router;
