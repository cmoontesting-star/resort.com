import React from 'react'
import Link from 'next/link';
import { auth } from "@/app/adminAuth";
import { redirect } from "next/navigation";

import DBConnection from "@/utils/config/db";
import SubAdmin from "@/utils/models/subadmins";
import SubAdminActions from "./SubAdminActions";
export const dynamic = 'force-dynamic';

const SubAdmins = async () => {
    const session = await auth();
    if (!session || !["superadmin", "admin"].includes(session.user.role)) {
        redirect("/admin/dashboard");
    }

    let data = [];
    try {
        await DBConnection();
        const subAdmins = await SubAdmin.find().select("-password").sort({ _id: -1 }).lean();
        // Convert MongoDB ObjectId to string to pass to Client Components if needed, or serialize it.
        data = subAdmins.map(admin => ({
            ...admin,
            _id: admin._id.toString(),
            createdBy: admin.createdBy?.toString() || null,
        }));
    } catch (err) {
        console.error("Failed to fetch subadmins", err);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Sub Admins
            </h1>

            <div className="flex justify-end mb-4">
                <Link href="/admin/subadmins/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
                    Add Sub Admin
                </Link>
            </div>

            <div className="bg-white rounded shadow">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Mobile</th>
                            <th className="px-4 py-2">Is Active</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((subadmin) => (
                                <tr key={subadmin._id} className="border-b">
                                    <td className="px-4 py-2 text-gray-700">{subadmin.username || subadmin.fullName}</td>
                                    <td className="px-4 py-2 text-gray-700">{subadmin.email}</td>
                                    <td className="px-4 py-2 text-gray-700">{subadmin.mobile}</td>
                                    <td className="px-4 py-2 text-gray-700">{subadmin.isActive ? "Yes" : "No"}</td>

                                    <td className="px-4 py-2 text-right">
                                        <SubAdminActions email={subadmin.email} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                    No sub-admins found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SubAdmins
