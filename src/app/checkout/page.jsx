"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import {
    Calendar,
    Users,
    MapPin,
    CreditCard,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    Receipt,
    User,
    Mail,
    Phone,
    Home,
    Map,
    BadgeCheck,
    CheckCircle2,
    Loader2
} from "lucide-react"

const CheckoutContent = () => {
    const searchParams = useSearchParams()

    // Read query parameters
    const resortId = searchParams.get("resortId") || ""
    const roomId = searchParams.get("roomId") || ""
    const rawPrice = searchParams.get("price")
    const price = rawPrice ? Number(rawPrice) : 2000
    const roomName = searchParams.get("roomName") || "Luxury Suite"
    const resortName = searchParams.get("resortName") || "Dream Vacation Resort"

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zip, setZip] = useState("")
    const [country, setCountry] = useState("")
    const [adults, setAdults] = useState("")
    const [children, setChildren] = useState("")
    const [checkin, setCheckin] = useState("")
    const [checkout, setCheckout] = useState("")

    const [loading, setLoading] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [paymentId, setPaymentId] = useState("")

    // Load Razorpay checkout.js once on mount
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)
        return () => { document.body.removeChild(script) }
    }, [])

    const resetForm = () => {
        setName(""); setEmail(""); setPhone(""); setAddress("")
        setCity(""); setState(""); setZip(""); setCountry("")
        setAdults(""); setChildren(""); setCheckin(""); setCheckout("")
    }

    const saveBooking = async (razorpayPaymentId) => {
        try {
            await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, email, phone, address, city, state,
                    zip, country, adults, children, checkin, checkout,
                    paymentId: razorpayPaymentId,
                    totalAmount: price,
                    resortId,
                    roomId,
                }),
            })
        } catch (err) {
            console.error("Booking save error:", err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1 ─ Create Razorpay order via backend
            const orderRes = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: price }),
            })
            const orderData = await orderRes.json()

            if (!orderData.success) {
                alert("Could not initiate payment: " + orderData.message)
                setLoading(false)
                return
            }

            // 2 ─ Open Razorpay modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Resorts.com",
                description: `Booking for ${resortName}`,
                order_id: orderData.order.id,
                prefill: { name, email, contact: phone },
                theme: { color: "#2563eb" },
                handler: async (response) => {
                    // 3 ─ Save booking after payment success
                    setPaymentId(response.razorpay_payment_id)
                    await saveBooking(response.razorpay_payment_id)
                    resetForm()
                    setLoading(false)
                    setBookingSuccess(true)
                },
                modal: {
                    ondismiss: () => setLoading(false),
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.open()

        } catch (error) {
            console.error("Payment error:", error)
            alert("Something went wrong. Please try again.")
            setLoading(false)
        }
    }

    const inputClass = "w-full border border-slate-200 bg-slate-50 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm text-slate-800 placeholder:text-slate-400"
    const inputNoIconClass = "w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm text-slate-800 placeholder:text-slate-400"

    // ─── Booking Success Screen ───
    if (bookingSuccess) {
        return (
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl p-10 md:p-14 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle2 size={44} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Your payment was successful and your luxury stay has been reserved. A confirmation will be sent to your email.
                    </p>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left space-y-2.5 text-xs text-slate-600 mb-7">
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Payment ID</span>
                            <span className="font-bold text-slate-700 font-mono">{paymentId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Amount Paid</span>
                            <span className="font-bold text-green-600 text-sm">₹{price.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                    <a
                        href="/bookings"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-blue-500/30 text-sm"
                    >
                        View My Bookings
                        <ArrowRight size={16} />
                    </a>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="mb-10">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-4">
                        <ShieldCheck size={12} />
                        Secure Checkout
                    </span>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Complete Your Booking
                    </h1>
                    <p className="text-slate-500 mt-2 text-base max-w-xl">
                        Fill in your details below to confirm your luxury stay.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ─── LEFT COLUMN – Form ─── */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* ── Guest Information ── */}
                            <section className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800">Guest Information</h2>
                                        <p className="text-xs text-slate-400">Primary guest details</p>
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={16} /></span>
                                            <input type="text" placeholder="John Doe" value={name}
                                                onChange={(e) => setName(e.target.value)} className={inputClass} required />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={16} /></span>
                                            <input type="email" placeholder="you@example.com" value={email}
                                                onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={16} /></span>
                                            <input type="text" placeholder="+91 98765 43210" value={phone}
                                                onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ── Stay Information ── */}
                            <section className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800">Stay Information</h2>
                                        <p className="text-xs text-slate-400">Select your dates & guests</p>
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Check-in */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Check-in Date</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Calendar size={16} /></span>
                                            <input type="date" value={checkin}
                                                onChange={(e) => setCheckin(e.target.value)} className={inputClass} required />
                                        </div>
                                    </div>

                                    {/* Check-out */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Check-out Date</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Calendar size={16} /></span>
                                            <input type="date" value={checkout}
                                                onChange={(e) => setCheckout(e.target.value)} className={inputClass} required />
                                        </div>
                                    </div>

                                    {/* Adults */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adults (18+ yrs)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Users size={16} /></span>
                                            <select value={adults} onChange={(e) => setAdults(e.target.value)} className={inputClass} required>
                                                <option value="">Select adults</option>
                                                {[1, 2, 3, 4, 5, 6].map(n => (
                                                    <option key={n} value={n}>{n} {n === 1 ? "Adult" : "Adults"}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Children */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Children (0–17 yrs)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Users size={16} /></span>
                                            <select value={children} onChange={(e) => setChildren(e.target.value)} className={inputClass}>
                                                <option value="">No children</option>
                                                {[1, 2, 3, 4].map(n => (
                                                    <option key={n} value={n}>{n} {n === 1 ? "Child" : "Children"}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ── Billing Address ── */}
                            <section className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                                        <Home size={16} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800">Billing Address</h2>
                                        <p className="text-xs text-slate-400">For invoice & payment records</p>
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Street Address */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Street Address</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Home size={16} /></span>
                                            <input type="text" placeholder="123 Main Street, Apt 4B" value={address}
                                                onChange={(e) => setAddress(e.target.value)} className={inputClass} required />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City</label>
                                        <input type="text" placeholder="Mumbai" value={city}
                                            onChange={(e) => setCity(e.target.value)} className={inputNoIconClass} required />
                                    </div>

                                    {/* State */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">State / Region</label>
                                        <input type="text" placeholder="Maharashtra" value={state}
                                            onChange={(e) => setState(e.target.value)} className={inputNoIconClass} required />
                                    </div>

                                    {/* ZIP */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ZIP / Postal Code</label>
                                        <input type="text" placeholder="400001" value={zip}
                                            onChange={(e) => setZip(e.target.value)} className={inputNoIconClass} required />
                                    </div>

                                    {/* Country */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Country</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Map size={16} /></span>
                                            <input type="text" placeholder="India" value={country}
                                                onChange={(e) => setCountry(e.target.value)} className={inputClass} required />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ── Submit / Pay Button ── */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-base group cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Processing Payment...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        <span>Pay ₹{price.toLocaleString("en-IN")} via Razorpay</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </button>

                            {/* Razorpay badge */}
                            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                                <ShieldCheck size={13} className="text-slate-400" />
                                Payments are 100% secured and powered by&nbsp;
                                <span className="font-bold text-slate-600">Razorpay</span>
                            </p>

                        </form>
                    </div>

                    {/* ─── RIGHT COLUMN – Summary ─── */}
                    <div className="space-y-5">
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 lg:sticky lg:top-28 space-y-5">

                            {/* Resort badge */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Selection</span>
                                    <BadgeCheck size={13} className="text-blue-500" />
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">{resortName}</h3>
                                <div className="flex items-center gap-1.5 mt-1.5 text-slate-500 text-xs">
                                    <MapPin size={13} className="text-slate-400" />
                                    <span>Premium Vacation Destination</span>
                                </div>
                            </div>

                            {/* Room pill */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Selected Room</span>
                                    <span className="text-sm font-bold text-slate-800 mt-0.5 block">{roomName}</span>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 font-bold px-2.5 py-1.5 rounded-lg border border-blue-100">
                                    <Sparkles size={11} />
                                    Top Choice
                                </span>
                            </div>

                            {/* Check-in / Check-out display */}
                            <div className="grid grid-cols-2 gap-3 text-xs py-4 border-y border-slate-100">
                                <div>
                                    <span className="font-semibold text-slate-400 block mb-1">Check-in</span>
                                    <span className="font-bold text-slate-700">{checkin || "— / — / ——"}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-400 block mb-1">Check-out</span>
                                    <span className="font-bold text-slate-700">{checkout || "— / — / ——"}</span>
                                </div>
                                <div className="col-span-2 flex items-center justify-between text-slate-500 pt-2">
                                    <span>Guests</span>
                                    <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                                        {adults ? `${adults} Adult${Number(adults) > 1 ? "s" : ""}` : "—"}
                                        {children && Number(children) > 0 ? `, ${children} Child${Number(children) > 1 ? "ren" : ""}` : ""}
                                    </span>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Receipt size={13} className="text-slate-400" />
                                    Amount Details
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Room Price</span>
                                        <span className="font-medium text-slate-800">₹{price.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>GST (18%)</span>
                                        <span className="font-medium text-slate-800">₹0</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Resort Service Fee</span>
                                        <span className="font-medium text-slate-800">₹0</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Convenience Fee</span>
                                        <span className="font-medium text-slate-800">₹0</span>
                                    </div>
                                    <div className="pt-3 mt-2 border-t border-slate-100 flex justify-between items-baseline">
                                        <span className="font-bold text-slate-900 text-base">Total</span>
                                        <span className="text-2xl font-black text-blue-600 tracking-tight">₹{price.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badge */}
                            <div className="flex items-start gap-3 bg-green-50 border border-green-100 p-4 rounded-xl text-xs text-green-700">
                                <ShieldCheck size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block">Free Cancellation</span>
                                    <span className="text-green-600 mt-0.5 block">Cancel up to 24 hours prior to check-in for a full refund.</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}

const page = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col">
            <Header />
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center py-24 gap-3 text-slate-400">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                    <span className="text-sm font-medium">Loading checkout...</span>
                </div>
            }>
                <CheckoutContent />
            </Suspense>
            <Footer />
        </div>
    )
}

export default page