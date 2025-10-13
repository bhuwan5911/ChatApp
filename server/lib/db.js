import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // DEBUG: Let's print the variable to see what it contains
        console.log("Attempting to connect with MONGO_URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
    } catch (error) {
        console.log("Error connecting to database", error);
    }
};