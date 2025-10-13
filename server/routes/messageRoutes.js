// server/routes/messageRoutes.js

import express from 'express';
import { getUsersForSidebar, getMessages, sendMessage, markMessageAsSeen } from '../controllers/messageController.js';
import { protectRoute } from '../middleware/auth.js';

const messageRouter = express.Router();

// Route to get users for the sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// ADDED: Route to get messages for a specific user
messageRouter.get("/:id", protectRoute, getMessages);

// ADDED: Route to send a message to a specific user
messageRouter.post("/send/:id", protectRoute, sendMessage);

// ADDED: Route to mark a message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

export default messageRouter;