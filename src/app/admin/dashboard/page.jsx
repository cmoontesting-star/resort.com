"use client";

import { useState, useEffect } from "react";
import { House, GraduationCap, Bed, TowelRack, UsersRound, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        resorts: 0,
        subadmins: 0,
        rooms: 0,
        bookings: 0,
        customers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const data = await res.json();
                if (data.success && data.stats) {
                    setStats(data.stats);
                }
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Resorts",
            value: stats.resorts,
            icon: House,
            color: "from-blue-500 to-cyan-500",
            bgLight: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "Sub Admins",
            value: stats.subadmins,
            icon: GraduationCap,
            color: "from-purple-500 to-indigo-500",
            bgLight: "bg-purple-50",
            textColor: "text-purple-600"
        },
        {
            title: "Total Rooms",
            value: stats.rooms,
            icon: Bed,
            color: "from-emerald-500 to-teal-500",
            bgLight: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            title: "Active Bookings",
            value: stats.bookings,
            icon: TowelRack,
            color: "from-amber-500 to-orange-500",
            bgLight: "bg-amber-50",
            textColor: "text-amber-600"
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500 font-medium">Loading stats...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin</h1>
                <p className="text-gray-500 mt-1 text-sm">Here is a quick overview of your resorts dashboard metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => {
                    const IconComponent = card.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition duration-150"></div>
                            
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">{card.title}</span>
                                    <span className="text-3xl font-bold text-gray-800 tracking-tight block">{card.value}</span>
                                </div>
                                <div className={`p-3 rounded-lg ${card.bgLight} ${card.textColor}`}>
                                    <IconComponent size={22} />
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                                <span>Updated just now</span>
                                <ArrowUpRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-150" size={14} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Resorts Booking Trends</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                        <span className="text-gray-400 text-sm">Interactive charts will display once customer bookings are received.</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
                    <div className="flex flex-col gap-2.5">
                        <a href="/admin/resorts/add" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-slate-50 transition text-sm font-medium text-gray-700">
                            <span>Add New Resort</span>
                            <ArrowUpRight size={16} className="text-gray-400" />
                        </a>
                        <a href="/admin/room/add" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-slate-50 transition text-sm font-medium text-gray-700">
                            <span>Add New Room</span>
                            <ArrowUpRight size={16} className="text-gray-400" />
                        </a>
                        <a href="/admin/subadmins/add" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-slate-50 transition text-sm font-medium text-gray-700">
                            <span>Add Sub Admin</span>
                            <ArrowUpRight size={16} className="text-gray-400" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
