"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

const AddResortPage = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [formData, setFormData] = useState({
        resortName: "",
        description: "",
        status: "active",
        ownerId: ""
    });

    const [images, setImages] = useState([]);
    const [amenitiesText, setAmenitiesText] = useState("");
    const [subAdmins, setSubAdmins] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (session?.user?.role === "subadmin") {
            setFormData(prev => ({
                ...prev,
                ownerId: session.user.userid
            }));
        } else if (session?.user?.role === "superadmin") {
            const fetchSubAdmins = async () => {
                try {
                    const res = await fetch("/api/admin/subadmins");
                    if (res.ok) {
                        const data = await res.json();
                        setSubAdmins(data);
                        if (data.length > 0) {
                            setFormData(prev => ({
                                ...prev,
                                ownerId: data[0]._id
                            }));
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch subadmins", err);
                }
            };
            fetchSubAdmins();
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.resortName) {
            alert("Please enter a Resort Name");
            return;
        }

        if (!formData.ownerId) {
            alert("An owner must be selected to create a resort.");
            return;
        }

        setIsSubmitting(true);

        try {
            const amenitiesArray = amenitiesText.split(",").map(item => item.trim()).filter(Boolean);

            const payload = {
                ...formData,
                images: images,
                amenities: amenitiesArray
            };

            const res = await fetch("/api/admin/resorts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Resort added successfully!");
                router.push("/admin/resorts");
                router.refresh();
            } else {
                alert(data.message || "Failed to add resort");
            }
        } catch (error) {
            console.error("Error creating resort:", error);
            alert("An error occurred while adding the resort.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Resort</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Resort Name *</label>
                    <input
                        type="text"
                        name="resortName"
                        placeholder="e.g. Ocean Blue Resort"
                        value={formData.resortName}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Description</label>
                    <textarea
                        name="description"
                        placeholder="Provide details about the resort, rooms, views..."
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Resort Images</label>
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

                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img src={img} alt={`resort-upload-${index}`} className="w-full h-24 object-cover" />
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

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Amenities (comma-separated)</label>
                    <input
                        type="text"
                        placeholder="WiFi, Pool, Gym, Spa, Restaurant"
                        value={amenitiesText}
                        onChange={(e) => setAmenitiesText(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {session?.user?.role === "superadmin" && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Assign Owner (Sub Admin) *</label>
                        {subAdmins.length > 0 ? (
                            <select
                                name="ownerId"
                                value={formData.ownerId}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {subAdmins.map(admin => (
                                    <option key={admin._id} value={admin._id}>
                                        {admin.fullName} ({admin.email})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-red-500 text-sm font-semibold">
                                No Sub Admins found. Please create a Sub Admin first.
                            </p>
                        )}
                    </div>
                )}

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
                        disabled={isSubmitting || (session?.user?.role === "superadmin" && subAdmins.length === 0)}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? "Adding..." : "Add Resort"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddResortPage;