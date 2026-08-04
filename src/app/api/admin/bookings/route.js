import { NextResponse } from "next/server";
import DBConnection from "@/utils/config/db";
import Booking from "@/utils/models/Booking";
import Resort from "@/utils/models/Resort";
import Room from "@/utils/models/Room";
import { auth as adminAuth } from "@/app/adminAuth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;

        let query = {};
        if (role === "subadmin") {
            const resorts = await Resort.find({ ownerId: userid });
            const resortIds = resorts.map(r => r._id);
            query = { resortId: { $in: resortIds } };
        }

        const bookings = await Booking.find(query)
            .populate({ path: "resortId", model: Resort, select: "resortName" })
            .populate({ path: "roomId", model: Room, select: "roomName roomType price" })
            .sort({ _id: -1 });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return NextResponse.json(
            { message: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const { bookingId, bookingStatus, paymentStatus } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
        }

        const existingBooking = await Booking.findById(bookingId);
        if (!existingBooking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }

        // Security check: verify subadmin owns the resort of this booking
        if (role === "subadmin") {
            const resort = await Resort.findById(existingBooking.resortId);
            if (!resort || resort.ownerId.toString() !== userid) {
                return NextResponse.json({ message: "Unauthorized: You do not own the resort for this booking." }, { status: 403 });
            }
        }

        const updateData = {};
        if (bookingStatus) updateData.bookingStatus = bookingStatus;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true })
            .populate({ path: "resortId", model: Resort, select: "resortName" })
            .populate({ path: "roomId", model: Room, select: "roomName roomType price" });

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error("Failed to update booking:", error);
        return NextResponse.json(
            { message: "Failed to update booking" },
            { status: 500 }
        );
    }
}
