import express from "express";
import User from "../models/UserModel.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import transport from "../config/transport.js";
import jwt from "jsonwebtoken";



dotenv.config();

const router = express.Router();

router.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        const hashed = await bcryptjs.hash(password,10);
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); 

        await User.create({
            name,
            email,
            password:hashed,
            otp,
            otpExpiry
        })

        await transport.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"OTP for registration",
            text:`Your OTP is ${otp}`
        })

        res.status(201).json({message:"User registered successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
})

router.post('/verify-otp',async (req,res)=>{
    const {email,otp} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }

        if(user.otp !== otp){
            return res.status(400).json({message:"Invalid OTP"});
        }

        if(user.otpExpiry < Date.now()){
            return res.status(400).json({message:"OTP expired"});
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        res.status(200).json({message:"User verified successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});

router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        
        if(!user.isVerified){
            return res.status(400).json({message:"User is not verified"});
        }

        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(200).json({message:"User logged in successfully",token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});
       


export default router