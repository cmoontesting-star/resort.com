"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RoomActions from "./roomAction";

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("/api/admin/rooms");
                const data = await response.json();
                if (data.success) {
                    setRooms(data.data);
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div className="w-full min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl text-blue-700">Rooms</h2>
                <Link href="/admin/room/add" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
                    Add New Room
                </Link>
            </div>
            
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="px-6 py-3.5 text-sm font-semibold text-gray-700">Room Name</th>
                            <th className="px-6 py-3.5 text-sm font-semibold text-gray-700">Resort Name</th>
                            <th className="px-6 py-3.5 text-sm font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-3.5 text-sm font-semibold text-gray-700">Price</th>
                            <th className="px-6 py-3.5 text-sm font-semibold text-gray-700">Capacity</th>
                            <th className="px-6 py-3.5 text-sm font-semibold text-gray-700">Inventory (Avail / Total)</th>
                            <th className="px-6 py-3.5 text-sm font-semibold text-gray-700">Room Image</th>
                            <th className="px-6 py-3.5 text-sm font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length > 0 ? (
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
                                                className="w-16 h-12 object-cover rounded shadow-sm"
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
