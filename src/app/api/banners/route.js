




import Banner from "@/utils/models/banner";
import DBConnection from "@/utils/config/db";
import { NextResponse } from "next/server";


export const POST = async (req) => {
    try {
        await DBConnection();
        const { image, title, description, buttonText, isActive } = await req.json();
        const banner = new Banner({ image, title, description, buttonText, isActive });
        await banner.save();
        return NextResponse.json({ message: "Banner created successfully", banner }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create banner", error }, { status: 500 });
    }
}


export const GET = async (req) => {
    try {
        await DBConnection();
        const banners = await Banner.find();
        return NextResponse.json({ message: "Banners fetched successfully", banners }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch banners", error }, { status: 500 });
    }
}