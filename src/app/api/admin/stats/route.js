import { NextResponse } from "next/server";
import DBConnection from "@/utils/config/db";
import Resort from "@/utils/models/Resort";
import SubAdmin from "@/utils/models/subadmins";
import Rooms from "@/utils/models/Room";
import Booking from "@/utils/models/Booking";
import User from "@/utils/models/user";
import { auth as adminAuth } from "@/app/adminAuth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;

        if (role === "superadmin" || role === "admin") {
            const [resortsCount, subadminsCount, roomsCount, bookingsCount, usersCount] = await Promise.all([
                Resort.countDocuments(),
                SubAdmin.countDocuments(),
                Rooms.countDocuments(),
                Booking.countDocuments().catch(() => 0),
                User.countDocuments({ role: "user" }).catch(() => 0)
            ]);

            return NextResponse.json({
                success: true,
                stats: {
                    resorts: resortsCount,
                    subadmins: subadminsCount,
                    rooms: roomsCount,
                    bookings: bookingsCount,
                    customers: usersCount || 10
                }
            });
        } else if (role === "subadmin") {
            // Find subadmin's resorts
            const resorts = await Resort.find({ ownerId: userid });
            const resortIds = resorts.map(r => r._id);

            // Find rooms and bookings for those resorts
            const [roomsCount, bookingsCount] = await Promise.all([
                Rooms.countDocuments({ resortId: { $in: resortIds } }),
                Booking.countDocuments({ resortId: { $in: resortIds } }).catch(() => 0)
            ]);

            // Find unique customer count for bookings of these resorts
            const uniqueCustomers = await Booking.distinct("email", { resortId: { $in: resortIds } });

            return NextResponse.json({
                success: true,
                stats: {
                    resorts: resorts.length,
                    subadmins: 0, // subadmins cannot manage other subadmins
                    rooms: roomsCount,
                    bookings: bookingsCount,
                    customers: uniqueCustomers.length
                }
            });
        }

        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
