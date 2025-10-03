// server/middleware/auth.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }

        // This will decode the payload { userId: "..." }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }

        // We use decoded.userId to find the user
        req.user = await User.findById(decoded.userId).select("-password");
        
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        next();

    } catch (error) {
        console.error("Authorization Error:", error.message);
        res.status(401).json({ success: false, message: "Not authorized" });
    }
};