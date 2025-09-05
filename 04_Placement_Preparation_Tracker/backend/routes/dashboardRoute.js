import express from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Job from "../models/JobsModel.js";
import Application from "../models/ApplicationModel.js";

dotenv.config();

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Authentication failed" });
    }
};


const router = express.Router();


router.post('/', async (req,res)=>{
    const {token} = req.body;
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    } 
})

router.post('/job-post', authenticate, async (req, res) => {
    const {title, description, salary, location, experience, skills, applicationDeadline, CGPA} = req.body;
    
    // Validate required fields
    if (!title || !description || !salary || !location || !experience || !skills || !applicationDeadline || !CGPA) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate data types and ranges
    if (isNaN(salary) || salary <= 0) {
        return res.status(400).json({ message: "Invalid salary value" });
    }

    if (isNaN(experience) || experience < 0) {
        return res.status(400).json({ message: "Invalid experience value" });
    }

    if (isNaN(CGPA) || CGPA < 0 || CGPA > 10) {
        return res.status(400).json({ message: "CGPA must be between 0 and 10" });
    }

    // Validate application deadline
    const deadlineDate = new Date(applicationDeadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate < new Date()) {
        return res.status(400).json({ message: "Invalid application deadline" });
    }

    try {
        // Ensure user has permission to post jobs (company or TPO)
        if (!['company', 'tpo'].includes(req.user.role)) {
            return res.status(403).json({ message: "You don't have permission to post jobs" });
        }

        const job = await Job.create({
            title,
            description,
            salary,
            location,
            experience,
            skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
            applicationDeadline: deadlineDate,
            CGPA,
            createdBy: req.user._id,
            company: req.user.name
        });

        res.status(201).json({
            message: "Job posted successfully",
            job
        });
    } catch (error) {
        console.error("Job posting error:", error);
        res.status(500).json({ message: "Failed to post job. Please try again." });
    }
});

router.get('/jobs', authenticate, async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' }).populate('createdBy', 'name email');
        res.status(200).json({ jobs });
    } catch (error) {
        console.error("Job fetching error:", error);
        res.status(500).json({ message: "Failed to fetch jobs. Please try again." });
    }
});

// Get single job details
router.get('/jobs/:id', authenticate, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json({ job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch job details" });
    }
});

// Apply for a job
router.post('/jobs/:id/apply', authenticate, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if user is a student
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: "Only students can apply for jobs" });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: job._id,
            student: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // Check CGPA requirement
        if (req.user.cgpa < job.CGPA) {
            return res.status(400).json({ message: "Your CGPA does not meet the minimum requirement" });
        }

        // Check application deadline
        if (new Date(job.applicationDeadline) < new Date()) {
            return res.status(400).json({ message: "Application deadline has passed" });
        }

        // Create application
        const application = await Application.create({
            job: job._id,
            student: req.user._id,
            company: job.createdBy,
            status: 'pending'
        });

        res.status(201).json({ 
            message: "Application submitted successfully",
            application 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit application" });
    }
});

// Get count of jobs applied by student
router.get('/applied-jobs-count', authenticate, async (req, res) => {
    try {
        // Check if user is a student
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: "Access denied" });
        }

        // Count applications by this student
        const count = await Application.countDocuments({ student: req.user._id });
        
        res.json({ count });
    } catch (error) {
        console.error('Error fetching applied jobs count:', error);
        res.status(500).json({ message: "Failed to fetch applied jobs count" });
    }
});

export default router