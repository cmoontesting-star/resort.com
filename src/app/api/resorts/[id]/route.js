import { NextResponse } from "next/server";
import Resort from "@/utils/models/Resort";
import DBConnection from "@/utils/config/db";

// GET /api/resorts/[id] — fetch a single resort by ID
export async function GET(req, { params }) {
    try {
        await DBConnection();
        const { id } = await params;
        const resort = await Resort.findById(id);
        if (!resort) {
            return NextResponse.json({ success: false, message: "Resort not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, resort }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
