"use client";

import { useState, useEffect } from "react";
import { UsersRound, RefreshCw, CheckCircle, XCircle, ShieldAlert } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleActive = async (userId, currentStatus) => {
        setUpdating(userId);
        const newStatus = !currentStatus;
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, isActive: newStatus }),
            });

            if (res.ok) {
                const updated = await res.json();
                setUsers(users.map(u => u._id === userId ? updated : u));
            } else {
                alert("Failed to update user status");
            }
        } catch (err) {
            console.error("Error updating user status", err);
            alert("Error updating user status");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500 font-medium">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <UsersRound className="text-blue-600" size={32} />
                        Users Management
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        View registered customers and manage their account status (activation/deactivation).
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-2 bg-white text-gray-700 hover:text-blue-600 border border-gray-200 px-4 py-2 rounded-lg font-medium shadow-sm transition duration-150 text-sm cursor-pointer"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {users.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                    <ShieldAlert className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-700">No Customers Found</h3>
                    <p className="text-gray-400 text-sm mt-1">There are no customer accounts registered in the database yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <th className="py-4 px-6">Username / Name</th>
                                    <th className="py-4 px-6">Email Address</th>
                                    <th className="py-4 px-6">Mobile Number</th>
                                    <th className="py-4 px-6">Role</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition">
                                        <td className="py-4 px-6 font-semibold text-gray-800">
                                            {user.username || "N/A"}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {user.mobile || "N/A"}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${user.role === "superadmin" ? "bg-purple-100 text-purple-700" : ""}
                                                ${user.role === "subadmin" ? "bg-blue-100 text-blue-700" : ""}
                                                ${!user.role || user.role === "customer" ? "bg-slate-100 text-slate-700" : ""}
                                            `}>
                                                {user.role || "customer"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5">
                                                {user.isActive ? (
                                                    <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                        <CheckCircle size={12} />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-rose-600 font-semibold text-xs bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                                        <XCircle size={12} />
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleToggleActive(user._id, user.isActive)}
                                                disabled={updating === user._id}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer border
                                                    ${user.isActive
                                                        ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                                                        : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                                    }
                                                `}
                                            >
                                                {user.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
