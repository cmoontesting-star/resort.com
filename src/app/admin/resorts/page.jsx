
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ResortActions from "./ResortActions";

const ResortsPage = () => {

    const [resorts, setResorts] = useState([])




    useEffect(() => {
        const fetchResorts = async () => {
            try {
                const response = await fetch("/api/admin/resorts");
                const data = await response.json();
                setResorts(data);
            } catch (error) {
                console.error("Error fetching resorts:", error);
            }
        };
        fetchResorts();
    }, [])

    return (
        <div className="w-full min-h-screen">
            <div className="flex justify-between">
                <h2>Resorts</h2>
                {/* add new resort  button */}
                <Link href="/admin/resorts/add" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Add New Resort</Link>
            </div>
            {/* Search bar */}
            <div className="mt-4">
                <input type="text" placeholder="Search" className="border border-gray-300 rounded px-4 py-2" />
            </div>
            <div className="bg-white rounded shadow mt-5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">resort Name  </th>
                            <th className="px-4 py-2">Resort Owner Name  </th>
                            <th className="px-4 py-2">Resort Mobile  </th>
                            <th className="px-4 py-2">Resort Image</th>
                            <th className="px-4 py-2">Is Active</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resorts.length > 0 ? (
                            resorts.map((resort) => (
                                <tr key={resort._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700 font-medium">{resort.resortName}</td>
                                    <td className="px-4 py-3 text-gray-700">{resort.ownerId?.fullName || "Unknown"}</td>
                                    <td className="px-4 py-3 text-gray-700">{resort.ownerId?.mobile || "N/A"}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {resort.images && resort.images.length > 0 ? (
                                            <img
                                                src={resort.images[0]}
                                                alt={resort.resortName}
                                                className="w-16 h-12 object-cover rounded shadow-sm"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No image</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${resort.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}>
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
                                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                    No resorts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default ResortsPage;
