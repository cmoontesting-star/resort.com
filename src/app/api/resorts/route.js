import { NextResponse } from "next/server";

import Resort from "@/utils/models/Resort";
import DBConnection from "@/utils/config/db";

export async function GET() {
    try {
        await DBConnection();

        const resorts = await Resort.find({
            status: "active",
        });

        return NextResponse.json({
            success: true,
            resorts,
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