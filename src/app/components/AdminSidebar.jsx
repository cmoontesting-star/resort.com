"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    GraduationCap,
    LayoutDashboard,
    House,
    Bed,
    TowelRack,
    UsersRound,
    Info,
    ChevronDown,
    ChevronRight,
    ContactRound,
    Gavel,
    Shield,
    Quote,
    Images
} from 'lucide-react';

export default function AdminSidebar() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const isSuperAdmin = session?.user?.role === "superadmin" || session?.user?.role === "admin";

    const isActive = (path) => pathname === path;

    const linkClass = (path) => `
        flex items-center gap-3 transition-all duration-150 rounded-lg px-4 py-2.5 font-medium cursor-pointer
        ${isActive(path)
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-300 hover:text-white hover:bg-slate-800"
        }
    `;

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen border-r border-slate-800 flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Resort Admin
                    </span>
                </Link>
            </div>

            <nav className="p-4 flex flex-col gap-2.5 flex-1">
                <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>

                {isSuperAdmin && (
                    <Link href="/admin/subadmins" className={linkClass("/admin/subadmins")}>
                        <GraduationCap size={20} />
                        <span>SubAdmins</span>
                    </Link>
                )}

                {isSuperAdmin && (
                    <Link href="/admin/banners" className={linkClass("/admin/banners")}>
                        <Images size={20} />
                        <span>Banners</span>
                    </Link>
                )}

                <Link href="/admin/resorts" className={linkClass("/admin/resorts")}>
                    <House size={20} />
                    <span>Resorts</span>
                </Link>

                <Link href="/admin/room" className={linkClass("/admin/room")}>
                    <Bed size={20} />
                    <span>Rooms</span>
                </Link>

                <Link href="/admin/bookings" className={linkClass("/admin/bookings")}>
                    <TowelRack size={20} />
                    <span>Bookings</span>
                </Link>

                <Link href="/admin/users" className={linkClass("/admin/users")}>
                    <UsersRound size={20} />
                    <span>Users</span>
                </Link>

                <div className="flex flex-col gap-1.5 w-full">
                    <button
                        onClick={() => setOpen(!open)}
                        className={`flex items-center justify-between transition-all duration-150 rounded-lg px-4 py-2.5 font-medium cursor-pointer w-full text-left
                            ${pathname.includes("/admin/cms")
                                ? "bg-slate-800 text-white"
                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Info size={20} />
                            <span>CMS</span>
                        </div>
                        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    {open && (
                        <div className="flex flex-col gap-1.5 pl-6 mt-1">
                            <Link href="/admin/cms/aboutus" className={linkClass("/admin/cms/aboutus")}>
                                <Info size={16} />
                                <span className="text-sm">About Us</span>
                            </Link>
                            <Link href="/admin/cms/contact" className={linkClass("/admin/cms/contact")}>
                                <ContactRound size={16} />
                                <span className="text-sm">Contact Us</span>
                            </Link>
                            <Link href="/admin/cms/terms" className={linkClass("/admin/cms/terms")}>
                                <Gavel size={16} />
                                <span className="text-sm">Terms</span>
                            </Link>
                            <Link href="/admin/cms/privacy" className={linkClass("/admin/cms/privacy")}>
                                <Shield size={16} />
                                <span className="text-sm">Privacy</span>
                            </Link>
                            <Link href="/admin/cms/faq" className={linkClass("/admin/cms/faq")}>
                                <Quote size={16} />
                                <span className="text-sm">FAQ</span>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}