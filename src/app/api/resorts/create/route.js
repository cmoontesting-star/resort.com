import { NextResponse } from "next/server";

import Resort from "@/utils/models/Resort";
import DBConnection from "@/utils/config/db";

export async function POST(req) {
    try {
        await DBConnection();

        const body = await req.json();

        const resort = await Resort.create({
            resortName: body.resortName,
            location: body.location,
            address: body.address,
            description: body.description,
            images: body.images,
            amenities: body.amenities,
            ownerId: body.ownerId,
        });

        return NextResponse.json({
            success: true,
            resort,
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