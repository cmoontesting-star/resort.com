import Banner from "@/utils/models/banner";
import DBConnection from "@/utils/config/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await DBConnection();
        const { id } = await params;
        const banner = await Banner.findById(id);
        if (!banner) {
            return NextResponse.json({ message: "Banner not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, banner }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch banner", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await DBConnection();
        const { id } = await params;
        const { image, title, description, buttonText, isActive } = await req.json();
        const banner = await Banner.findByIdAndUpdate(
            id,
            { image, title, description, buttonText, isActive },
            { new: true }
        );
        if (!banner) {
            return NextResponse.json({ message: "Banner not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Banner updated successfully", banner }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update banner", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await DBConnection();
        const { id } = await params;
        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) {
            return NextResponse.json({ message: "Banner not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Banner deleted successfully", banner }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete banner", error: error.message }, { status: 500 });
    }
}