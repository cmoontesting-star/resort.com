"use client"

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminNavbar() {
    const router = useRouter();
    const { data: session } = useSession();

    const userRole = session?.user?.role;


    const handleLogout = async () => {
        try {
            const csrfRes = await fetch("/api/admin-auth/csrf");
            const { csrfToken } = await csrfRes.json();

            await fetch("/api/admin-auth/signout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    csrfToken,
                    callbackUrl: "/admin",
                }),
            });

            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/admin";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    return (
        <header className="bg-white shadow px-6 py-4">

            <div className="flex justify-between items-center">

                <h2 className="text-xl font-semibold">
                    {userRole === "superadmin" ? "Super Admin Panel" : "Sub Admin Panel"}
                </h2>

                <div className="flex items-center gap-4">

                    <span className="text-gray-700">{session?.user?.username || "Admin"}</span>

                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition cursor-pointer text-sm" onClick={handleLogout}>
                        Logout
                    </button>

                </div>

            </div>

        </header >
    );
}