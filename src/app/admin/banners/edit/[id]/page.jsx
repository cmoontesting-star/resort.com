"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from "next-auth/react";

const editBannerPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { data: session } = useSession();

    useEffect(() => {
        if (session && !["superadmin", "admin"].includes(session.user?.role)) {
            router.push("/admin/dashboard");
        }
    }, [session, router]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        buttonText: "",
        isActive: true,
    });
    const [image, setImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await fetch(`/api/banners/${id}`);
                const data = await res.json();
                if (res.ok && data.banner) {
                    setFormData({
                        title: data.banner.title || "",
                        description: data.banner.description || "",
                        buttonText: data.banner.buttonText || "",
                        isActive: data.banner.isActive !== false,
                    });
                    setImage(data.banner.image || "");
                } else {
                    console.error("Failed to fetch banner:", data?.message);
                }
            } catch (error) {
                console.error("Error fetching banner:", error);
            }
        };
        if (id) {
            fetchBanner();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage("");
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title) {
            alert("Please enter a Banner Title");
            return;
        }
        if (!formData.description) {
            alert("Please enter a Description");
            return;
        }
        if (!formData.buttonText) {
            alert("Please enter a Button Text");
            return;
        }
        if (!image) {
            alert("Please upload a Banner Image");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                image: image
            };

            const res = await fetch(`/api/banners/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Banner updated successfully!");
                router.push("/admin/banners");
                router.refresh();
            } else {
                alert(data.message || "Failed to update banner");
            }
        } catch (error) {
            console.error("Error updating banner:", error);
            alert("An error occurred while updating the banner.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Edit Banner</h1>

            <form onSubmit={handleEdit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Banner Title *</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Ocean Blue Resort"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Description *</label>
                    <textarea
                        name="description"
                        placeholder="Provide details about the banner..."
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Button Text *</label>
                    <input
                        type="text"
                        name="buttonText"
                        placeholder="e.g. View More"
                        value={formData.buttonText}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Banner Image *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p className="text-sm text-gray-600 font-medium text-center">Click or drag image here to upload</p>
                        <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG, WEBP</p>
                    </div>

                    {image && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <div className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img src={image} alt="banner-upload" className="w-full h-24 object-cover" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition shadow"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Status</label>
                    <select
                        name="isActive"
                        value={formData.isActive ? "true" : "false"}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === "true" }))}
                        className="border border-gray-300 rounded px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
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
                        {isSubmitting ? "Updating..." : "Update Banner"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default editBannerPage;