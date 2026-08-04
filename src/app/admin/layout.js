"use client";

import AdminNavbar from "@/app/components/AdminNavbar";
import AdminSidebar from "@/app/components/AdminSidebar";
import { usePathname, useRouter } from "next/navigation";
import { useSession, SessionProvider, __NEXTAUTH } from "next-auth/react";
import { useEffect } from "react";

function AdminLayoutContent({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const isLoginPage = pathname === "/admin";

    useEffect(() => {
        __NEXTAUTH.basePath = "/api/admin-auth";
    }, []);

    useEffect(() => {
        if (!isLoginPage && status === "unauthenticated") {
            router.push("/admin");
        }
        if (!isLoginPage && status === "authenticated" && !["superadmin", "subadmin", "admin"].includes(session?.user?.role)) {
            router.push("/");
        }
    }, [status, session, isLoginPage, router]);

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500 font-medium">Loading...</span>
            </div>
        );
    }

    if (!session || !["superadmin", "subadmin", "admin"].includes(session?.user?.role)) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminNavbar />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }) {
    return (
        <SessionProvider basePath="/api/admin-auth">
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SessionProvider>
    );
}
