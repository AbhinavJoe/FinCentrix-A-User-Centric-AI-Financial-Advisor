// import mongoose from 'mongoose';

// // Define the MongoDB URI
// const MONGO_URI = process.env.MONGO_URL;

// // Check if the MONGO_URI is defined
// if (!MONGO_URI) {
//     throw new Error('Please define the MONGO_URI environment variable inside .env.local');
// }

// export const dbConnect = async () => {
//     if (mongoose.connection.readyState >= 1) {
//         return;
//     }

//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log("Connected to MongoDB successfully.");
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         process.exit(1);
//     }
// };


import mongoose from 'mongoose';

// Define the MongoDB URI
const AZURE_MONGODB_URI = process.env.AZURE_MONGODB_URI;

// Check if the AZURE_MONGODB_URI is defined
if (!AZURE_MONGODB_URI) {
    throw new Error('Please define the AZURE_MONGODB_URI environment variable inside .env.local');
}

export const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(AZURE_MONGODB_URI);
        console.log("Connected to MongoDB successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
