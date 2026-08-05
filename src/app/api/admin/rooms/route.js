import { NextResponse } from "next/server";
import DBConnection from "@/utils/config/db";
import Rooms from "@/utils/models/Room";
import Resort from "@/utils/models/Resort";
import mongoose from "mongoose";
import { auth as adminAuth } from "@/app/adminAuth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ======================
// GET ALL ROOMS
// ======================
export async function GET() {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;

        let query = {};
        if (role === "subadmin") {
            const resorts = await Resort.find({ ownerId: userid });
            const resortIds = resorts.map(r => r._id);
            query.resortId = { $in: resortIds };
        }

        const rooms = await Rooms.find(query).populate({
            path: "resortId",
            select: "resortName ownerId",
            populate: {
                path: "ownerId",
                select: "fullName mobile"
            }
        }).sort({ _id: -1 });

        return NextResponse.json(
            {
                success: true,
                data: rooms,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET /api/admin/rooms:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch rooms",
            },
            { status: 500 }
        );
    }
}

// ======================
// CREATE ROOM
// ======================
export async function POST(req) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const body = await req.json();

        // Security check: verify subadmin owns the resort
        if (role === "subadmin") {
            const resort = await Resort.findById(body.resortId);
            if (!resort || resort.ownerId.toString() !== userid) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized: You do not own this resort." },
                    { status: 403 }
                );
            }
        }

        const room = await Rooms.create({
            resortId: new mongoose.Types.ObjectId(body.resortId),
            roomName: body.roomName,
            roomType: body.roomType,
            price: body.price,
            capacity: body.capacity,
            totalRooms: body.totalRooms,
            availableRooms: body.availableRooms,
            roomImages: body.roomImages || [],
        });

        return NextResponse.json(
            {
                success: true,
                message: "Room created successfully",
                data: room,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}