import SubAdmin from "@/utils/models/subadmins";
import DBConnection from "@/utils/config/db";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        await DBConnection();

        const { id } = await params;
        const subAdmin = await SubAdmin.findOne({ email: id });
        return NextResponse.json({
            success: true,
            subAdmin,
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await DBConnection();

        const { id } = await params;
        const subAdmin = await SubAdmin.findOneAndDelete({ email: id });
        return NextResponse.json({
            success: true,
            subAdmin,
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await DBConnection();
        const { id } = await params;
        const body = await req.json();

        // If password is provided, hash it, otherwise don't update password
        const updateData = {
            fullName: body.fullName,
            mobile: body.mobile,
            isActive: body.isActive,
        };

        if (body.password) {
            const bcrypt = await import("bcryptjs");
            updateData.password = await bcrypt.hash(body.password, 10);
        }

        const subAdmin = await SubAdmin.findOneAndUpdate(
            { email: id },
            updateData,
            { new: true }
        );

        if (!subAdmin) {
            return NextResponse.json({ success: false, message: "Sub Admin not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, subAdmin });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}