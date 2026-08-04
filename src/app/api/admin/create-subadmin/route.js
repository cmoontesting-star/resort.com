import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import SubAdmin from "@/utils/models/subadmins";
import DBConnection from "@/utils/config/db";
import { auth as adminAuth } from "@/app/adminAuth";

export async function POST(req) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        if (role !== "superadmin" && role !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden: Only superadmins can create subadmins." }, { status: 403 });
        }

        const body = await req.json();

        const existingUser = await SubAdmin.findOne({
            email: body.email,
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already exists",
                },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(
            body.password,
            10
        );

        const subAdmin = await SubAdmin.create({
            fullName: body.fullName,
            email: body.email,
            mobile: body.mobile,
            password: hashedPassword,
            role: "subadmin",
            createdBy: body.superAdminId,
        });

        return NextResponse.json({
            success: true,
            subAdmin,
        });
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