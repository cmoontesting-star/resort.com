import { NextResponse } from "next/server";
import Resort from "@/utils/models/Resort";
import DBConnection from "@/utils/config/db";
import { auth as adminAuth } from "@/app/adminAuth";

export async function GET(req, { params }) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const { id } = await params;

        const resort = await Resort.findById(id).populate("ownerId", "fullName email mobile");
        if (!resort) {
            return NextResponse.json({ message: "Resort not found" }, { status: 404 });
        }

        // Security check: verify subadmin owns the resort
        if (role === "subadmin") {
            if (resort.ownerId?._id?.toString() !== userid && resort.ownerId?.toString() !== userid) {
                return NextResponse.json({ message: "Unauthorized: You do not own this resort." }, { status: 403 });
            }
        }

        return NextResponse.json({ success: true, resort });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch resort", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const { id } = await params;

        // Security check: verify subadmin owns the resort before deleting
        if (role === "subadmin") {
            const existingResort = await Resort.findById(id);
            if (!existingResort) {
                return NextResponse.json({ message: "Resort not found" }, { status: 404 });
            }
            if (existingResort.ownerId?.toString() !== userid) {
                return NextResponse.json({ message: "Unauthorized: You do not own this resort." }, { status: 403 });
            }
        }

        const resort = await Resort.findByIdAndDelete(id);
        if (!resort) {
            return NextResponse.json({ message: "Resort not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, resort });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete resort", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await DBConnection();

        const adminSession = await adminAuth();
        if (!adminSession) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { role, userid } = adminSession.user;
        const { id } = await params;
        const body = await req.json();

        // Security check: verify subadmin owns the resort before updating
        if (role === "subadmin") {
            const existingResort = await Resort.findById(id);
            if (!existingResort) {
                return NextResponse.json({ message: "Resort not found" }, { status: 404 });
            }
            if (existingResort.ownerId?.toString() !== userid) {
                return NextResponse.json({ message: "Unauthorized: You do not own this resort." }, { status: 403 });
            }
            
            // Subadmin should not be allowed to reassign ownerId
            delete body.ownerId;
        }

        const resort = await Resort.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!resort) {
            return NextResponse.json({ message: "Resort not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, resort });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update resort", error: error.message }, { status: 500 });
    }
}
