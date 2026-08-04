import mongoose from "mongoose";


const DBConnection = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database Connection Error:", error);
        // Throw an error so server actions stop executing instead of hanging
        throw new Error("Database connection failed");
    }
};

export default DBConnection;
