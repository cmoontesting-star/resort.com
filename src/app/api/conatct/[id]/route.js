import Contact from "@/utils/models/contact";
import DBConnection from "@/utils/config/db";
import { NextResponse } from "next/server";


export const PUT = async (req, { params }) => {
    try {
        await DBConnection();
        const { id } = params;
        const { title, description, bannerImage, name, phone, email, subject, message } = await req.json();
        const contact = await Contact.findByIdAndUpdate(id, { title, description, bannerImage, name, phone, email, subject, message });
        return NextResponse.json({ message: "Contact updated successfully", banner }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update contact", error }, { status: 500 });
    }
}



