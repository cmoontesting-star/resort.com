import { NextResponse } from "next/server";
import SubAdmin from "@/utils/models/subadmins";
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

        const { role } = adminSession.user;
        if (role !== "superadmin" && role !== "admin") {
            return NextResponse.json({ message: "Forbidden: Subadmins cannot view other subadmins." }, { status: 403 });
        }

        const subAdmins = await SubAdmin.find()
            .select("-password")
            .sort({ _id: -1 });

        return NextResponse.json(subAdmins);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch sub admins" },
            { status: 500 }
        );
    }
}
