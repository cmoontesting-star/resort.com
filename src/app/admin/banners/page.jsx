"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BannerActions from "./bannerAction";

const BannersPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated" && !["superadmin", "admin"].includes(session?.user?.role)) {
            router.replace("/admin/dashboard");
        }
    }, [session, status, router]);

    const fetchBanners = async () => {
        try {
            const response = await fetch("/api/banners");
            const data = await response.json();
            if (response.ok) {
                setBanners(data.banners || []);
            } else {
                console.error("Failed to fetch banners:", data.message);
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <div className="w-full min-h-screen p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Banners</h2>
                <Link href="/admin/banners/add">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                        Add Banner
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-150 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Button Text</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                    Loading banners...
                                </td>
                            </tr>
                        ) : banners.length > 0 ? (
                            banners.map((banner) => (
                                <tr key={banner._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {banner.image ? (
                                            <img
                                                src={banner.image}
                                                alt={banner.title}
                                                className="w-16 h-10 object-cover rounded border border-gray-200 shadow-sm"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{banner.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{banner.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{banner.buttonText}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${banner.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                            {banner.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <BannerActions
                                            bannerId={banner._id}
                                            onDeleteSuccess={(id) => setBanners(prev => prev.filter(b => b._id !== id))}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                    No banners found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BannersPage;