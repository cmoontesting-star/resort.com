import { NextResponse } from "next/server";
import DBConnection from "@/utils/config/db";
import AboutUs from "@/utils/models/AboutUs";

export async function GET() {
    try {
        await DBConnection();

        const aboutUs = await AboutUs.find();

        return NextResponse.json({
            success: true,
            data: aboutUs,
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

export async function POST(req) {
    try {
        await DBConnection();

        const body = await req.json();

        const existing = await AboutUs.findOne();

        let aboutUs;

        if (existing) {
            aboutUs = await AboutUs.findByIdAndUpdate(
                existing._id,
                body,
                { new: true }
            );
        } else {
            aboutUs = await AboutUs.create(body);
        }

        return NextResponse.json({
            success: true,
            message: "About Us saved successfully",
            data: aboutUs,
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

export async function DELETE() {
    try {
        await DBConnection();
        await AboutUs.deleteMany({});
        return NextResponse.json({
            success: true,
            message: "About Us deleted successfully",
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