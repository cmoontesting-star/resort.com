import { NextResponse } from "next/server";
import DBConnection from "@/utils/config/db";
import Booking from "@/utils/models/Booking";
import Resort from "@/utils/models/Resort";
import Room from "@/utils/models/Room";
import { auth as adminAuth } from "@/app/adminAuth";
import { auth as userAuth } from "@/app/auth";

export const POST = async (request) => {
    try {
        await DBConnection();

        const body = await request.json();

        // Coerce numeric fields — form selects send strings
        const bookingData = {
            ...body,
            adults: Number(body.adults),
            children: body.children ? Number(body.children) : 0,
            totalAmount: body.totalAmount ? Number(body.totalAmount) : 0,
        };

        const booking = await Booking.create(bookingData);

        return NextResponse.json(
            {
                success: true,
                message: "Booking Created Successfully",
                data: booking,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/bookings error:", error.message);
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}

export const GET = async (request) => {
    try {
        await DBConnection();

        // 1. Check if it's an admin/subadmin request
        const adminSession = await adminAuth();
        if (adminSession) {
            const { role, userid } = adminSession.user;

            if (role === "superadmin" || role === "admin") {
                // Superadmin sees all bookings
                const bookings = await Booking.find({})
                    .populate("resortId roomId")
                    .sort({ createdAt: -1 });
                return NextResponse.json({ success: true, data: bookings }, { status: 200 });
            } else if (role === "subadmin") {
                // Subadmin sees only bookings for their own resorts
                const resorts = await Resort.find({ ownerId: userid });
                const resortIds = resorts.map(r => r._id);
                
                const bookings = await Booking.find({ resortId: { $in: resortIds } })
                    .populate("resortId roomId")
                    .sort({ createdAt: -1 });
                return NextResponse.json({ success: true, data: bookings }, { status: 200 });
            }
        }

        // 2. Check if it's a regular user request
        const userSession = await userAuth();
        if (userSession) {
            // Find bookings matching the logged-in user's email
            const bookings = await Booking.find({ email: userSession.user.email })
                .populate("resortId roomId")
                .sort({ createdAt: -1 });
            return NextResponse.json({ success: true, data: bookings }, { status: 200 });
        }

        // 3. Fallback for unauthorized/unauthenticated request
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    } catch (error) {
        console.error("GET /api/bookings error:", error.message);
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
