"use server";

import bcrypt from "bcryptjs";
import User from "@/utils/models/user";
import DBConnection from "@/utils/config/db";

export default async function loginAction(data) {
    try {
        await DBConnection();

        const user = await User.findOne({
            email: data.email,
        });

        if (!user) {
            return {
                success: false,
                message: "User Not Found",
            };
        }

        const isMatch = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!isMatch) {
            return {
                success: false,
                message: "Invalid Password",
            };
        }

        return {
            success: true,
            message: "Login Successful",
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Login Failed",
        };
    }
}