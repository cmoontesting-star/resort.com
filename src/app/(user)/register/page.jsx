"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import registerAction from "@/app/serverActions/registerAction"


export default function Register() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")


    const register = async (e) => {
        e.preventDefault()
        const registerdetails = {
            username,
            email,
            mobile,
            password
        }
        console.log(registerdetails)
        try {
            const result = await registerAction(registerdetails)
            if (result.success) {
                alert("User registered successfully")
                router.push("/login")
            }
            else {
                alert(result.message || "Registration Failed") // <-- Use server response message
            }
        } catch (error) {
            alert("Registration Failed")
        }





    }
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
                <form onSubmit={register} className="w-full max-w-md bg-gray-50 shadow-lg border border-gray-200 rounded-2xl p-6 md:p-8 space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Register</h1>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input
                            type="text"
                            placeholder="Mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-md cursor-pointer"
                    >
                        Register
                    </button>
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="w-full py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition duration-200 cursor-pointer"
                    >
                        Already Registered? Login
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
}