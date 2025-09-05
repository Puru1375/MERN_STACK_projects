import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import dashboardRoute from "./routes/dashboardRoute.js"



const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;


app.use('/api/auth',authRoute)
app.use('/dashboard',dashboardRoute)


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});