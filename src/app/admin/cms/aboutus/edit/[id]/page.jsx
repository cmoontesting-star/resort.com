"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const editAboutUsPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        image: "",
    });

    const [image, setImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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

    // Fetch existing About Us on mount
    useEffect(() => {
        const fetchAboutUs = async () => {
            try {
                const response = await fetch("/api/admin/aboutus");
                const data = await response.json();
                if (response.ok && data.success && data.data && data.data.length > 0) {
                    const existing = data.data[0];
                    setFormData({
                        title: existing.title || "",
                        description: existing.description || "",
                    });
                    setImage(existing.bannerImage || "");
                }
            } catch (error) {
                console.error("Error fetching About Us:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAboutUs();
    }, []);

    const handleAboutUs = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            alert("Please enter a Title");
            return;
        }
        if (!formData.description) {
            alert("Please enter a Description");
            return;
        }
        if (!image) {
            alert("Please upload a Banner Image");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/aboutus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    bannerImage: image,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert("About Us saved successfully!");
                router.push("/admin/cms/aboutus");
                router.refresh();
            } else {
                alert(data.message || "Failed to save About Us");
            }
        } catch (error) {
            console.error("Error saving About Us:", error);
            alert("An error occurred while saving About Us.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-gray-500 font-medium">Loading About Us details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Manage About Us Content</h1>

            <form className="flex flex-col gap-6" onSubmit={handleAboutUs}>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Title *</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Welcome to Dream Escapes"
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
                        placeholder="Provide details for the about us section..."
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
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
                            <div className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm col-span-2">
                                <img src={image} alt="aboutus-upload" className="w-full h-32 object-cover" />
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

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? "Saving..." : "Save About Us"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default editAboutUsPage;