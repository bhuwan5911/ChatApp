// server/models/Message.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    // Timestamps will create `createdAt` and `updatedAt` fields automatically
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;