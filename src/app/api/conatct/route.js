
import DBConnection from "@/utils/config/db";
import { NextResponse } from "next/server";
import Contact from "@/utils/models/contact";


export const POST = async (req) => {
    try {
        await DBConnection();
        const { name, phone, email, subject, message } = await req.json();
        const contact = new Contact({ name, phone, email, subject, message });
        await contact.save();
        return NextResponse.json({ success: true, message: "Contact created successfully", contact }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to create contact", error }, { status: 500 });
    }
}
export const GET = async (req) => {
    try {
        await DBConnection();
        const contacts = await Contact.find();
        return NextResponse.json({ success: true, message: "Contacts fetched successfully", contacts }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch contacts", error }, { status: 500 });
    }
}