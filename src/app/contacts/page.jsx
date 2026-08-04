'use client'

import { useState } from "react"
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function ContactPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNo, setPhoneNo] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null) // "success" | "error" | null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            const response = await fetch("/api/conatct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone: phoneNo,
                    email,
                    subject,
                    message,
                }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setStatus("success")
                setName("")
                setPhoneNo("")
                setEmail("")
                setSubject("")
                setMessage("")
            } else {
                setStatus("error")
            }
        } catch (error) {
            console.error(error)
            setStatus("error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <Header />
            {/* Banner */}
            <div className="relative w-full h-[300px] bg-gradient-to-r from-blue-800 to-blue-500 flex items-center justify-center">
                <div className="text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold">Contact Us</h1>
                    <p className="mt-3 text-lg text-blue-100">We'd love to hear from you</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="max-w-5xl mx-auto mt-12 mb-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-200 rounded-2xl overflow-hidden shadow-md">

                {/* Left Info Section */}
                <div className="flex flex-col justify-center bg-blue-50 p-10">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Get In Touch</h2>
                    <p className="text-gray-600 mb-6">
                        We'd love to hear from you. Send us your queries and our team will get back to you soon.
                    </p>
                    <div className="space-y-3 text-sm text-gray-700">
                        <p>📧 resort.com@gmail.com</p>
                        <p>📞 +91 88921 98123</p>
                        <p>📍 Wayanad, Kerala, India</p>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="bg-white p-8">
                    {status === "success" && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm">
                            ✅ Your message was sent successfully! We'll get back to you soon.
                        </div>
                    )}
                    {status === "error" && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
                            ❌ Something went wrong. Please try again.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <textarea
                            rows="5"
                            placeholder="Your Message"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}
