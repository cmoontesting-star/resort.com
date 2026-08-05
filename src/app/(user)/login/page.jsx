"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, __NEXTAUTH } from "next-auth/react"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        __NEXTAUTH.basePath = "/api/auth";
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        __NEXTAUTH.basePath = "/api/auth"

        try {
            const params = new URLSearchParams(window.location.search)
            const callbackUrl = params.get("callbackUrl") || "/"

            const res = await signIn("credentials", {
                email,
                password,
                loginType: "user",
                redirect: false,
                callbackUrl: callbackUrl
            })

            if (res?.error) {
                const errMsg = res.error === "CredentialsSignin" || res.error.includes("Readonly")
                    ? "Invalid email or password"
                    : res.error;
                setError(errMsg || "Login failed")
                setLoading(false)
            } else {
                window.location.href = callbackUrl
            }
        }
        catch (error) {
            console.log("Login Failed", error)
            setError("An error occurred during login. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
                <form onSubmit={handleLogin} className="w-full max-w-md bg-gray-50 shadow-lg border border-gray-200 rounded-2xl p-6 md:p-8 space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Login</h1>

                    {error && (
                        <p className="text-red-500 font-semibold mb-2 text-center bg-red-50 p-2.5 rounded-lg border border-red-100 text-sm">
                            {error}
                        </p>
                    )}

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Login</span>
                        )}
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/register")}
                        className="w-full py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition duration-200 cursor-pointer"
                    >
                        Don&apos;t have an account? Register
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    )
}
