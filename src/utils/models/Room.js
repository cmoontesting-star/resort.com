import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        resortId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resort",
            required: true,
        },

        roomName: {
            type: String,
            required: true,
        },

        roomType: {
            type: String,
            enum: [
                "Standard",
                "Deluxe",
                "Suite",
                "Villa",
                "Cottage",
            ],
        },

        price: {
            type: Number,
            required: true,
        },

        capacity: {
            type: Number,
            required: true,
        },

        totalRooms: {
            type: Number,
            required: true,
        },

        availableRooms: {
            type: Number,
            required: true,
        },

        roomImages: [String],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

const Rooms = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Rooms;