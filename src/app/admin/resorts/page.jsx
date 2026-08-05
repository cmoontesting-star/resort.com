"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ResortActions from "./ResortActions";

const ResortsPage = () => {
    const [resorts, setResorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResorts = async () => {
            try {
                const response = await fetch("/api/admin/resorts");
                const data = await response.json();
                setResorts(data || []);
            } catch (error) {
                console.error("Error fetching resorts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResorts();
    }, []);

    return (
        <div className="w-full min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Resorts</h2>
                <Link href="/admin/resorts/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer">
                    Add New Resort
                </Link>
            </div>

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
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
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
