import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// CORRECTED: Function name from getUserForSidebar to getUsersForSidebar
export const getUsersForSidebar = async (req, res) => {
    try {
        // CORRECTED: Changed res.user._id to req.user._id
        const userId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // Count number of messages not seen
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            // CORRECTED: Changed receiveId to receiverId
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });
        await Promise.all(promises);

        res.status(200).json({ success: true, users: filteredUsers, unseenMessages });
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// get all messages for a selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                // CORRECTED: Changed receivedId to receiverId and fixed typo selectedUserIdId
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time

        // Mark messages as seen
        // CORRECTED: Fixed the query to be correct
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { seen: true });
        
        res.status(200).json({ success: true, messages });

    } catch (error) {
        console.error("Error in getMessages: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// api to mark a message as seen using its ID
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error in markMessageAsSeen: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Send a message to the selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId, // Consistent naming
            text,
            image: imageUrl
        });

        // Emit the new message to the receiver's socket in real-time
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ success: true, newMessage });

    } catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};