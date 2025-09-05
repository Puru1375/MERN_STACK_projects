import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    skills: {
        type: [String], 
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    applicationDeadline: {
        type: Date,
        required: true,
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    CGPA: {
        type: Number,
        required: true,
    }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
