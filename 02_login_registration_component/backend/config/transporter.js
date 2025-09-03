import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
});