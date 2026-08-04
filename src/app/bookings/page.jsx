"use client"
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'
import { useEffect, useState } from 'react'
import {
    Calendar,
    Users,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    ShieldCheck,
    Clock,
    Inbox,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react'

const UserBookings = () => {

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/bookings")   // ✅ fixed: was /api/booking
            const data = await response.json()
            if (data.success) {
                setBookings(data.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const statusConfig = {
        Confirmed: {
            icon: <CheckCircle2 size={14} />,
            classes: "bg-green-50 text-green-700 border-green-200",
        },
        Cancelled: {
            icon: <XCircle size={14} />,
            classes: "bg-red-50 text-red-700 border-red-200",
        },
        Pending: {
            icon: <AlertCircle size={14} />,
            classes: "bg-amber-50 text-amber-700 border-amber-200",
        },
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "—"
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric"
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex flex-col">
            <Header />

            {/* Hero Banner */}
            <div className="relative w-full h-[280px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800" />
                {/* subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-900/50 border border-blue-700/50 px-4 py-1.5 rounded-full mb-4">
                        <ShieldCheck size={12} />
                        Verified Stays
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">My Bookings</h1>
                    <p className="text-slate-300 text-sm max-w-md">A complete history of your luxury resort reservations.</p>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 py-12 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">

                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500">
                            <Loader2 size={40} className="animate-spin text-blue-500" />
                            <p className="text-sm font-medium">Fetching your bookings...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && bookings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Inbox size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">No Bookings Yet</h3>
                            <p className="text-slate-400 text-sm max-w-xs">
                                You haven't made any reservations yet. Explore our luxury resorts and book your dream stay.
                            </p>
                            <a
                                href="/resorts"
                                className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-md"
                            >
                                Browse Resorts
                            </a>
                        </div>
                    )}

                    {/* Booking Cards */}
                    {!loading && bookings.length > 0 && (
                        <div className="space-y-5">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                {bookings.length} {bookings.length === 1 ? "Reservation" : "Reservations"} Found
                            </p>

                            {bookings.map((booking) => {
                                const status = statusConfig[booking.bookingStatus] || statusConfig.Pending
                                return (
                                    <div
                                        key={booking._id}
                                        className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                                    >
                                        {/* Card header */}
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Booking ID</p>
                                                <p className="text-xs font-mono font-bold text-slate-600">{booking._id}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${status.classes}`}>
                                                {status.icon}
                                                {booking.bookingStatus || "Pending"}
                                            </span>
                                        </div>

                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Guest Info */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Guest Details</p>
                                                <div className="flex items-center gap-2.5 text-sm text-slate-700">
                                                    <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                                        <Phone size={13} />
                                                    </span>
                                                    <span className="font-semibold">{booking.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                                    <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                        <Mail size={13} />
                                                    </span>
                                                    {booking.email}
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                                    <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                        <Phone size={13} />
                                                    </span>
                                                    {booking.phone}
                                                </div>
                                                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                                    <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5">
                                                        <MapPin size={13} />
                                                    </span>
                                                    <span>{booking.address}, {booking.city}, {booking.state} — {booking.zip}, {booking.country}</span>
                                                </div>
                                            </div>

                                            {/* Stay Info */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Stay Details</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                                            <Calendar size={10} /> Check-in
                                                        </p>
                                                        <p className="text-sm font-bold text-slate-800">{formatDate(booking.checkin)}</p>
                                                    </div>
                                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                                            <Calendar size={10} /> Check-out
                                                        </p>
                                                        <p className="text-sm font-bold text-slate-800">{formatDate(booking.checkout)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                                    <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                        <Users size={13} />
                                                    </span>
                                                    {booking.adults} {Number(booking.adults) === 1 ? "Adult" : "Adults"}
                                                    {booking.children && Number(booking.children) > 0
                                                        ? `, ${booking.children} ${Number(booking.children) === 1 ? "Child" : "Children"}`
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Footer */}
                                        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/60 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <CreditCard size={14} className="text-slate-400" />
                                                {booking.paymentId
                                                    ? <span className="font-mono text-slate-500">ID: {booking.paymentId}</span>
                                                    : <span className="text-slate-400 italic">No payment ID</span>}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Paid</p>
                                                <p className="text-lg font-black text-blue-600 tracking-tight">
                                                    ₹{booking.totalAmount
                                                        ? Number(booking.totalAmount).toLocaleString("en-IN")
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default UserBookings