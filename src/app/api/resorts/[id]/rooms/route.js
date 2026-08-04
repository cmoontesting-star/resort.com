import { NextResponse } from "next/server";
import DBConnection from "@/utils/config/db";
import Rooms from "@/utils/models/Room";

// GET /api/resorts/[id]/rooms — fetch all rooms for a specific resort
export async function GET(req, { params }) {
    try {
        await DBConnection();
        const { id } = await params;

        const rooms = await Rooms.find({ resortId: id });

        return NextResponse.json({ success: true, rooms }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
