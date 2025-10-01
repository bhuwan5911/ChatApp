import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from "socket.io";


// Create Express app and HTTP server
const app = express();
// CORRECTED: Call createServer and pass the Express app to it
const server = http.createServer(app); 

// initialize socket.io server
export const io = new Server (server, {
    cors: {origin: "*"}
})

// Store online users
export const userSocketMap = {} ; // { userId: socketId}

// Soclet.io connection handler
io.on ("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId] = socket.id;

    // emit online users to all connected clients 
    io.emit ("getOnlineUsers", Object.keys(userSocketMap));


    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})



// Middlewares setup 
app.use(express.json({ limit: "5mb" }));
app.use(cors());

// A simple route to check if the server is running
app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter)
app.use("/api/message", messageRouter)

// cinnect to mongoDB
await connect

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => console.log("Server is running on PORT:" + PORT));