"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, __NEXTAUTH } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        __NEXTAUTH.basePath = "/api/admin-auth";
    }, []);

    useEffect(() => {
        if (["superadmin", "subadmin", "admin"].includes(session?.user?.role)) {
            router.push("/admin/dashboard");
        }
    }, [session, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
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
                setLoading(false);
                return;
            }

            if (result?.ok && !result?.error) {
                window.location.href = "/admin/dashboard";
            }
        } catch (err) {
            console.error(err);
            setError("Invalid email or password");
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 font-medium">Checking session...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    Admin Login
                </h1>
                <p className="text-gray-500 text-sm text-center mb-6">
                    Enter your credentials to access the admin portal.
                </p>

                {error && (
                    <p className="text-red-500 font-semibold mb-4 text-center bg-red-50 p-2.5 rounded-lg border border-red-100 text-sm">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            placeholder="admin@resorts.com"
                            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            placeholder="••••••••"
                            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-white font-semibold py-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-sm"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <span>Login to Dashboard</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}