import mongoose from "mongoose";
import dns from "dns";

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const DBConnection = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not defined");
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongooseInstance) => {
            console.log("Database Connected Successfully");
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("Database Connection Error:", error);
        throw new Error(`Database connection failed: ${error.message || error}`);
    }

    return cached.conn;
};

export default DBConnection;
