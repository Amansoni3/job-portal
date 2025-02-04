import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email.",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        })

        return res.status(201).json({
            message: "User registered successfully.",
            success: true,
            user: newUser, // Optionally, send the created user object
        });

    } catch (error) {
        console.error("Registration error: ", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // Check if role matches before checking password
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with the selected role.",
                success: false
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // Generate JWT token
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        // Send response with token as HTTP-only cookie
        return res.status(200).cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true, // Prevents client-side JavaScript access
            sameSite: "strict", // Prevents CSRF attacks
        }).json({
            message: `Welcome back, ${user.fullname}!`,
            userData: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            },
            success: true
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error, 'error')
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body
        const file = req.file
        if (!fullname || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        // cloudinary will come here

        const skillsArray = skills.split(",")
        const userId = req.id // Middleware authentication
        let user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        user.fullname = fullname
        user.email = email
        user.phoneNumber = phoneNumber
        user.profile.bio = bio
        user.profile.skills = skillsArray
        
        await user.save()

        user = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role, 
            profile: user.profile
        }
        
        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        })

    } catch (error) {
        console.log(error, 'error')
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        })
    }
}