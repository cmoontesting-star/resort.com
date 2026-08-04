import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        mobile: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["superadmin", "subadmin", "customer"],
            default: "customer",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

export default User;