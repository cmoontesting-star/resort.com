import { NextResponse } from "next/server";
import DBConnection from "@/utils/config/db";
import User from "@/utils/models/user";
import Booking from "@/utils/models/Booking";
import Resort from "@/utils/models/Resort";
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

        let query = { role: { $ne: "superadmin" } };

        if (role === "subadmin") {
            // Find resorts owned by this subadmin
            const resorts = await Resort.find({ ownerId: userid });
            const resortIds = resorts.map(r => r._id);

            // Find all bookings for these resorts
            const bookings = await Booking.find({ resortId: { $in: resortIds } });
            const customerEmails = bookings.map(b => b.email);

            // Only return users who have booked at least one of this subadmin's resorts
            query = {
                email: { $in: customerEmails },
                role: "customer"
            };
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ _id: -1 });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json(
            { message: "Failed to fetch users" },
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

        const { role } = adminSession.user;
        if (role !== "superadmin" && role !== "admin") {
            return NextResponse.json({ message: "Forbidden: Only superadmins can manage user accounts." }, { status: 403 });
        }

        const { userId, isActive } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        return NextResponse.json(
            { message: "Failed to update user" },
            { status: 500 }
        );
    }
}
