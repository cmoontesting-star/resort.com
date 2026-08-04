"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AboutusActions from "./aboutusAction";

const AboutUsPage = () => {
    const [aboutUs, setAboutUs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutUs = async () => {
            try {
                const response = await fetch("/api/admin/aboutus");
                const data = await response.json();
                if (response.ok && data.success) {
                    setAboutUs(data.data || []);
                } else {
                    console.error("Failed to fetch About Us:", data.message);
                }
            } catch (error) {
                console.error("Error fetching About Us:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutUs();
    }, []);

    return (
        <div className="w-full min-h-screen p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage About Us</h2>
                <Link href="/admin/cms/aboutus/add">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer font-semibold text-sm">
                        Add About Us
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-150 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Banner Image</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                    Loading About Us...
                                </td>
                            </tr>
                        ) : aboutUs.length > 0 ? (
                            aboutUs.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.bannerImage ? (
                                            <img
                                                src={item.bannerImage}
                                                alt={item.title}
                                                className="w-16 h-10 object-cover rounded border border-gray-200 shadow-sm"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{item.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <AboutusActions
                                            aboutUsId={item._id}
                                            onDeleteSuccess={() => setAboutUs([])}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                    No About Us entries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AboutUsPage;