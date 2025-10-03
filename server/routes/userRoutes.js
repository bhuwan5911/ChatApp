import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

// Router variable ka naam 'userRoute' hai
const userRoute = express.Router();

userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.put("/update-profile", protectRoute, updateProfile);
userRoute.get("/check", protectRoute, checkAuth);

// CORRECTED: Yahan bhi 'userRoute' hi hona chahiye
export default userRoute;