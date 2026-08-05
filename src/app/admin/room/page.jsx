"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RoomActions from "./roomAction";

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("/api/admin/rooms");
                const data = await response.json();
                if (data.success) {
                    setRooms(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div className="w-full min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl text-blue-700">Rooms</h2>
                <Link href="/admin/room/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition">
                    Add New Room
                </Link>
            </div>
            
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
                                <td colSpan="8" className="px-6 py-10 text-center text-gray-500 font-medium">
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
                                    <td className="px-6 py-4 text-gray-700 font-semibold">${room.price}</td>
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
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
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
