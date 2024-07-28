import mongoose from 'mongoose';

// Define the MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bobdb';

// Check if the MONGO_URI is defined
if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

// Asynchronously function to connect to the database
export const dbConnect = async () => {
    // Check the current state to prevent unnecessary connections
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    // Connect to MongoDB and handle potential connection errors
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Optionally exit process on failure
    }
};
