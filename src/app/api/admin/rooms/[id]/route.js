import DBConnection from "@/utils/config/db";
import Rooms from "@/utils/models/Room";
import Resort from "@/utils/models/Resort";
import { NextResponse } from "next/server";
import { auth as adminAuth } from "@/app/adminAuth";

export async function GET(req, { params }) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const { id } = await params;

        const room = await Rooms.findById(id).populate("resortId");
        if (!room) {
            return NextResponse.json(
                { success: false, message: "Room not found" },
                { status: 404 }
            );
        }

        // Security check: verify subadmin owns the resort this room belongs to
        if (role === "subadmin") {
            if (!room.resortId || room.resortId.ownerId.toString() !== userid) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized: You do not own this resort." },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json(
            { success: true, data: room },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const { id } = await params;
        const body = await req.json();

        // Security check: verify subadmin owns both original resort and target resort
        if (role === "subadmin") {
            const originalRoom = await Rooms.findById(id).populate("resortId");
            if (!originalRoom) {
                return NextResponse.json(
                    { success: false, message: "Room not found" },
                    { status: 404 }
                );
            }
            if (!originalRoom.resortId || originalRoom.resortId.ownerId.toString() !== userid) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized: You do not own this room." },
                    { status: 403 }
                );
            }

            // If changing resorts, verify ownership of the target resort
            if (body.resortId && body.resortId !== originalRoom.resortId._id.toString()) {
                const targetResort = await Resort.findById(body.resortId);
                if (!targetResort || targetResort.ownerId.toString() !== userid) {
                    return NextResponse.json(
                        { success: false, message: "Unauthorized: You do not own the destination resort." },
                        { status: 403 }
                    );
                }
            }
        }

        const room = await Rooms.findByIdAndUpdate(
            id,
            {
                resortId: body.resortId,
                roomName: body.roomName,
                roomType: body.roomType,
                price: body.price,
                capacity: body.capacity,
                totalRooms: body.totalRooms,
                availableRooms: body.availableRooms,
                roomImages: body.roomImages,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!room) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Room not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Room updated successfully",
                data: room,
            },
            { status: 200 }
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

export async function DELETE(req, { params }) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const { id } = await params;

        // Security check: verify subadmin owns the resort before deleting its room
        if (role === "subadmin") {
            const room = await Rooms.findById(id).populate("resortId");
            if (!room) {
                return NextResponse.json(
                    { success: false, message: "Room not found" },
                    { status: 404 }
                );
            }
            if (!room.resortId || room.resortId.ownerId.toString() !== userid) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized: You do not own this room's resort." },
                    { status: 403 }
                );
            }
        }

        const room = await Rooms.findByIdAndDelete(id);

        if (!room) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Room not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Room deleted successfully",
            },
            { status: 200 }
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