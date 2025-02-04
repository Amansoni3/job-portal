import mongoose from "mongoose"; // Import mongoose for MongoDB interaction

// Define the User schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true // Full name is required
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true // Ensure email is unique
    },
    phoneNumber: {
        type: Number,
        required: true // Phone number is required
    },
    password: {
        type: String,
        required: true // Password is required
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'], // Role can only be 'student' or 'recruiter'
        required: true
    },
    profile: {
        bio: { type: String }, // User's bio
        skills: [{ type: String }], // Array of skills
        resume: { type: String }, // URL to uploaded resume file
        resumeOriginalName: { type: String }, // Original name of the uploaded resume file
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // Reference to Company model
        profilePhoto: {
            type: String,
            default: "" // Default empty string if no profile photo is set
        }
    }
}, { timestamps: true }) // Enable timestamps for createdAt and updatedAt fields

// Create and export the User model
export const User = mongoose.model('User', userSchema);
