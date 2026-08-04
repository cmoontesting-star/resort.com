"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const AddRooms = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [resorts, setResorts] = useState([]);

    const [formData, setFormData] = useState({
        roomName: "",
        roomType: "",
        resortId: "",
        price: "",
        capacity: "",
        totalRooms: "",
        availableRooms: "",
    });

    const [roomImages, setRoomImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRoomImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (indexToRemove) => {
        setRoomImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        if (!formData.resortId) {
            alert("Please select a Resort");
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await fetch("/api/admin/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    capacity: Number(formData.capacity),
                    totalRooms: Number(formData.totalRooms),
                    availableRooms: Number(formData.availableRooms),
                    roomImages: roomImages,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Room added successfully");
                router.push("/admin/room");
                router.refresh();
            } else {
                alert(data.message || "Failed to add room");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchResorts = async () => {
            try {
                const res = await fetch("/api/admin/resorts");
                const data = await res.json();
                setResorts(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchResorts();
    }, []);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Room</h1>
            
            <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Room Name *</label>
                    <input
                        name="roomName"
                        value={formData.roomName}
                        onChange={handleChange}
                        required
                        type="text"
                        placeholder="e.g. Deluxe Sea View Suite"
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Room Type *</label>
                    <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Room Type</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Villa">Villa</option>
                        <option value="Cottage">Cottage</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Resort *</label>
                    <select
                        name="resortId"
                        value={formData.resortId}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Resort</option>
                        {resorts.map((resort) => (
                            <option key={resort._id} value={resort._id}>
                                {resort.resortName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Price per Night ($) *</label>
                    <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        type="number"
                        placeholder="e.g. 150"
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Max Capacity *</label>
                    <input
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        type="number"
                        placeholder="e.g. 2"
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Total Rooms *</label>
                        <input
                            name="totalRooms"
                            value={formData.totalRooms}
                            onChange={handleChange}
                            required
                            type="number"
                            placeholder="e.g. 10"
                            className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Available Rooms *</label>
                        <input
                            name="availableRooms"
                            value={formData.availableRooms}
                            onChange={handleChange}
                            required
                            type="number"
                            placeholder="e.g. 8"
                            className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Room Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p className="text-sm text-gray-600 font-medium text-center">Click or drag images here to upload</p>
                        <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG, WEBP</p>
                    </div>

                    {roomImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {roomImages.map((img, index) => (
                                <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img src={img} alt={`room-upload-${index}`} className="w-full h-24 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition shadow"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? "Adding..." : "Add Room"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRooms;
