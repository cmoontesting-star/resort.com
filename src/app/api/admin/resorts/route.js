import { NextResponse } from "next/server";
import Resort from "@/utils/models/Resort";
import DBConnection from "@/utils/config/db";
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
            query.ownerId = userid;
        }

        const resorts = await Resort.find(query)
            .populate("ownerId", "fullName email mobile")
            .sort({ _id: -1 });

        return NextResponse.json(resorts);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch resorts", error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const body = await req.json();

        // Enforce ownerId: subadmins can only create resorts owned by themselves
        if (role === "subadmin") {
            body.ownerId = userid;
        } else if (!body.ownerId) {
            return NextResponse.json({ message: "An ownerId is required." }, { status: 400 });
        }

        const resort = await Resort.create(body);

        return NextResponse.json({ success: true, resort });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create resort", error: error.message }, { status: 500 });
    }
}
