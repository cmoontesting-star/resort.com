import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },

        zip: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },

        adults: {
            type: Number,
            required: true,
        },

        children: {
            type: Number,
            default: 0,
        },

        checkin: {
            type: Date,
            required: true,
        },

        checkout: {
            type: Date,
            required: true,
        },

        bookingStatus: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },

        paymentId: {
            type: String,
            default: "",
        },

        totalAmount: {
            type: Number,
            default: 0,
        },

        resortId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resort",
            required: false,
        },

        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

if (mongoose.models.Booking) {
    delete mongoose.models.Booking;
}
export default mongoose.model("Booking", bookingSchema);