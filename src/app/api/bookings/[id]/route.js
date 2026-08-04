import { NextResponse } from "next/server";
import DBConnection from "@/utils/config/db";
import Booking from "@/utils/models/Booking";

export const PATCH = async (request, { params }) => {
    try {
        await DBConnection();

        const { id } = params;
        const body = await request.json();

        const updated = await Booking.findByIdAndUpdate(
            id,
            { bookingStatus: body.bookingStatus },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Booking not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/bookings/[id] error:", error.message);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
};
