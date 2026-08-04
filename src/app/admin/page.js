"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, __NEXTAUTH } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function AdminLogin() {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        __NEXTAUTH.basePath = "/api/admin-auth";
    }, []);

    useEffect(() => {
        if (["superadmin", "subadmin", "admin"].includes(session?.user?.role)) {
            // localStorage.clear();
            // sessionStorage.clear();
            router.push("/admin/dashboard");
        }
    }, [session, router]);

    const handleLogin = async (e) => {
        console.log("Login attempt...");
        e.preventDefault();

        setError("");
        __NEXTAUTH.basePath = "/api/admin-auth";

        try {
            const result = await signIn("credentials", {
                email,
                password,
                loginType: "admin",
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                return;
            }

            if (result?.ok && !result?.error) {
                window.location.href = "/admin/dashboard";
            }
        } catch (err) {
            console.error(err);
            setError("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-3xl font-bold text-center mb-2">
                    Admin Login
                </h1>

                {error && (
                    <p className="text-red-500 font-semibold mb-4 text-center">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded cursor-pointer"
                >
                    Login
                </button>
            </form>
        </div>
    );
}