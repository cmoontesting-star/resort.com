import mongoose from "mongoose";

const resortSchema = new mongoose.Schema(
    {
        resortName: {
            type: String,
            required: true,
        },
        description: String,

        images: [
            {
                type: String,
            },
        ],

        amenities: [
            {
                type: String,
            },
        ],

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubAdmin",
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive",],
            default: "inactive",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

const Resort = mongoose.models.Resort || mongoose.model("Resort", resortSchema);

export default Resort;