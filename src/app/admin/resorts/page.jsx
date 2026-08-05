"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ResortActions from "./ResortActions";
import { RefreshCw, Plus, AlertCircle } from "lucide-react";

const ResortsPage = () => {
    const [resorts, setResorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchResorts = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await fetch("/api/admin/resorts", {
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                },
            });
            const data = await response.json();

            if (response.ok) {
                setResorts(Array.isArray(data) ? data : []);
            } else {
                setError(data.message || "Failed to load resorts");
            }
        } catch (error) {
            console.error("Error fetching resorts:", error);
            setError("Failed to connect to server. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchResorts();
    }, [fetchResorts]);

    return (
        <div className="w-full min-h-screen space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Resorts Management</h2>
                    <p className="text-gray-500 text-sm mt-1">View and manage all registered resorts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchResorts(true)}
                        disabled={loading || refreshing}
                        className="flex items-center gap-2 bg-white text-gray-700 hover:text-blue-600 border border-gray-200 px-4 py-2 rounded-lg font-medium shadow-sm transition duration-150 text-sm cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={refreshing ? "animate-spin text-blue-600" : ""} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>
                    <Link
                        href="/admin/resorts/add"
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer shadow-sm text-sm"
                    >
                        <Plus size={16} />
                        <span>Add New Resort</span>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={18} className="text-red-500 shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                    <button
                        onClick={() => fetchResorts(true)}
                        className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition font-medium"
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Resort Name</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Resort Owner Name</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Resort Mobile</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Resort Image</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        <span>Loading resorts...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : resorts.length > 0 ? (
                            resorts.map((resort) => (
                                <tr key={resort._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-gray-800 font-medium">{resort.resortName}</td>
                                    <td className="px-4 py-3 text-gray-700">{resort.ownerId?.fullName || "Unknown"}</td>
                                    <td className="px-4 py-3 text-gray-700">{resort.ownerId?.mobile || "N/A"}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {resort.images && resort.images.length > 0 ? (
                                            <img
                                                src={resort.images[0]}
                                                alt={resort.resortName}
                                                className="w-16 h-12 object-cover rounded shadow-sm border border-gray-100"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No image</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${resort.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {resort.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <ResortActions resortId={resort._id} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                    No resorts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResortsPage;
