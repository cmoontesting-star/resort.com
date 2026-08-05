"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import RoomActions from "./roomAction";
import { RefreshCw, Plus, AlertCircle } from "lucide-react";

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchRooms = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await fetch("/api/admin/rooms", {
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                },
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setRooms(data.data || []);
            } else {
                setError(data.message || "Failed to load rooms");
            }
        } catch (err) {
            console.error("Error fetching rooms:", err);
            setError("Failed to connect to server. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return (
        <div className="w-full min-h-screen space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="font-bold text-3xl text-gray-800">Rooms Management</h2>
                    <p className="text-gray-500 text-sm mt-1">View and manage all resort room inventory.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchRooms(true)}
                        disabled={loading || refreshing}
                        className="flex items-center gap-2 bg-white text-gray-700 hover:text-blue-600 border border-gray-200 px-4 py-2 rounded-lg font-medium shadow-sm transition duration-150 text-sm cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={refreshing ? "animate-spin text-blue-600" : ""} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>
                    <Link
                        href="/admin/room/add"
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition shadow-sm text-sm"
                    >
                        <Plus size={16} />
                        <span>Add New Room</span>
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
                        onClick={() => fetchRooms(true)}
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
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Name</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Resort Name</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacity</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Inventory (Avail / Total)</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Image</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-12 text-center text-gray-500 font-medium">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        <span>Loading rooms...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : rooms.length > 0 ? (
                            rooms.map((room) => (
                                <tr key={room._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-gray-800 font-medium">{room.roomName}</td>
                                    <td className="px-6 py-4 text-gray-700">{room.resortId?.resortName || "N/A"}</td>
                                    <td className="px-6 py-4 text-gray-700">{room.roomType}</td>
                                    <td className="px-6 py-4 text-gray-700 font-semibold">₹{room.price}</td>
                                    <td className="px-6 py-4 text-gray-700">{room.capacity} Pax</td>
                                    <td className="px-6 py-4 text-gray-700">
                                        <span className="font-medium text-green-600">{room.availableRooms}</span> / {room.totalRooms}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {room.roomImages && room.roomImages.length > 0 ? (
                                            <img
                                                src={room.roomImages[0]}
                                                alt={room.roomName}
                                                className="w-16 h-12 object-cover rounded shadow-sm border border-gray-100"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <RoomActions roomId={room._id} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                    No rooms found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoomsPage;
