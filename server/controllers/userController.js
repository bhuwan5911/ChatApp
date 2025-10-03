import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        // CORRECTED: Logical condition to check for missing fields
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ success: false, message: "User already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);
        res.status(201).json({ success: true, userData: newUser, token, message: "Account created successfully." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// controller to login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // CORRECTED: Added missing '=' sign
        const userData = await User.findOne({ email });

        // CORRECTED: Added check to see if user exists before comparing password
        if (!userData) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const token = generateToken(userData._id);
        // CORRECTED: Changed success message
        res.status(200).json({ success: true, userData, token, message: "Login successful." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};

// controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        // CORRECTED: Made variable names consistent
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            // CORRECTED: Fixed syntax for accessing Cloudinary URL
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }

        res.status(200).json({ success: true, user: updatedUser });
    // CORRECTED: Removed extra closing brace
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};