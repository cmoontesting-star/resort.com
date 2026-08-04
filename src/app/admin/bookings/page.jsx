"use client";

import { useState, useEffect } from "react";
import {
    RefreshCw,
    Calendar,
    User,
    ShieldAlert,
    BookOpen,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Users,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock
} from "lucide-react";

const statusStyles = {
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:   "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const StatusBadge = ({ status }) => {
    const style = statusStyles[status] || statusStyles.Pending;
    const Icon = status === "Confirmed" ? CheckCircle2
        : status === "Cancelled" ? XCircle
        : AlertCircle;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${style}`}>
            <Icon size={12} />
            {status || "Pending"}
        </span>
    );
};

const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
    });
};

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/bookings");
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch (err) {
            console.error("Failed to load bookings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (bookingId, bookingStatus) => {
        setUpdating(bookingId);
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingStatus }),
            });
            if (res.ok) {
                const updated = await res.json();
                setBookings(bookings.map(b =>
                    b._id === bookingId ? { ...b, bookingStatus: updated.data?.bookingStatus || bookingStatus } : b
                ));
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status", err);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2.5">
                        <BookOpen className="text-blue-600" size={26} />
                        Bookings Management
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm">
                        All user reservations — view details and update booking status.
                    </p>
                </div>
                <button
                    onClick={fetchBookings}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white text-slate-600 hover:text-blue-600 border border-slate-200 px-4 py-2 rounded-xl font-medium shadow-sm transition text-sm cursor-pointer disabled:opacity-60"
                >
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: bookings.length, color: "blue" },
                    { label: "Confirmed", value: bookings.filter(b => b.bookingStatus === "Confirmed").length, color: "emerald" },
                    { label: "Pending", value: bookings.filter(b => b.bookingStatus === "Pending" || !b.bookingStatus).length, color: "amber" },
                    { label: "Cancelled", value: bookings.filter(b => b.bookingStatus === "Cancelled").length, color: "rose" },
                ].map(stat => (
                    <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-3xl font-black mt-1 text-${stat.color}-600`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
                    <Loader2 size={28} className="animate-spin text-blue-500" />
                    <span className="text-sm font-medium">Loading bookings...</span>
                </div>
            )}

            {/* Empty */}
            {!loading && bookings.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center shadow-sm">
                    <ShieldAlert className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-600">No Bookings Found</h3>
                    <p className="text-slate-400 text-sm mt-1">No bookings have been submitted yet.</p>
                </div>
            )}

            {/* Table */}
            {!loading && bookings.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                    <th className="py-4 px-5">Guest</th>
                                    <th className="py-4 px-5">Resort / Room</th>
                                    <th className="py-4 px-5">Contact</th>
                                    <th className="py-4 px-5">Stay Dates</th>
                                    <th className="py-4 px-5">Guests</th>
                                    <th className="py-4 px-5">Payment</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5">Update</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/60 transition">
                                        {/* Guest Name + Address */}
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                                    <User size={13} className="text-slate-400" />
                                                    {booking.name}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1 ml-5">
                                                    <MapPin size={11} />
                                                    {booking.city}, {booking.country}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Resort / Room */}
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-slate-800">
                                                    {booking.resortId?.resortName || "Dream Vacation Resort"}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {booking.roomId?.roomName || "Luxury Suite"} ({booking.roomId?.roomType || "Suite"})
                                                </span>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail size={12} className="text-slate-400" />
                                                    {booking.email}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Phone size={12} className="text-slate-400" />
                                                    {booking.phone}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Dates */}
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col gap-0.5 text-xs">
                                                <span className="flex items-center gap-1.5 text-slate-600">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    In: <span className="font-semibold">{formatDate(booking.checkin)}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-600">
                                                    <Clock size={12} className="text-slate-400" />
                                                    Out: <span className="font-semibold">{formatDate(booking.checkout)}</span>
                                                </span>
                                            </div>
                                        </td>

                                        {/* Guests */}
                                        <td className="py-4 px-5">
                                            <span className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <Users size={13} className="text-slate-400" />
                                                {booking.adults} Adult{Number(booking.adults) > 1 ? "s" : ""}
                                                {booking.children > 0 ? `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}` : ""}
                                            </span>
                                        </td>

                                        {/* Payment */}
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-black text-blue-600 text-base">
                                                    ₹{booking.totalAmount ? Number(booking.totalAmount).toLocaleString("en-IN") : "—"}
                                                </span>
                                                {booking.paymentId && (
                                                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                                        <CreditCard size={10} />
                                                        {booking.paymentId.slice(0, 18)}…
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status badge */}
                                        <td className="py-4 px-5">
                                            <StatusBadge status={booking.bookingStatus} />
                                        </td>

                                        {/* Update dropdown */}
                                        <td className="py-4 px-5">
                                            {updating === booking._id ? (
                                                <Loader2 size={16} className="animate-spin text-blue-500" />
                                            ) : (
                                                <select
                                                    value={booking.bookingStatus || "Pending"}
                                                    onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                                                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold border border-slate-200 bg-slate-50 outline-none cursor-pointer hover:border-blue-400 transition"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-400">
                        Showing {bookings.length} {bookings.length === 1 ? "booking" : "bookings"} · Sorted by newest first
                    </div>
                </div>
            )}
        </div>
    );
}
