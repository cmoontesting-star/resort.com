"use server";

import bcrypt from "bcryptjs";
import User from "@/utils/models/user";
import DBConnection from "@/utils/config/db";

export default async function registerUser(data) {
    try {
        await DBConnection();

        const existingUser = await User.findOne({
            email: data.email,
        });

        if (existingUser) {
            return {
                success: false,
                message: "Email already exists",
            };
        }

        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        );

        await User.create({
            username: data.username,
            email: data.email,
            mobile: data.mobile,
            password: hashedPassword,
        });

        return {
            success: true,
            message: "Registration Successful",
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: " Failed are empty please fill all the fields",
        };
    }
}