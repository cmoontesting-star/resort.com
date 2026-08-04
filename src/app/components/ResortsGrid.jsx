"use client";

import { useState, useEffect } from "react";
import { House, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ResortsGrid() {
    const [resorts, setResorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResorts = async () => {
            try {
                const res = await fetch("/api/resorts");
                const data = await res.json();
                if (data.success && data.resorts) {
                    setResorts(data.resorts);
                }
            } catch (err) {
                console.error("Failed to load resorts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResorts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500 font-medium">Discovering best resorts...</span>
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 pb-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Our Premium Escapes</h2>
                <p className="text-gray-500 mt-2">Handpicked luxury destinations curated just for your perfect vacation.</p>
            </div>

            {resorts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resorts.map((resort) => (
                        <div key={resort._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">

                            {/* Image Header */}
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                {resort.images && resort.images.length > 0 ? (
                                    <img
                                        src={resort.images[0]}
                                        alt={resort.resortName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <House size={40} className="stroke-1" />
                                        <span className="text-xs mt-2">No image preview</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1.5 shadow-sm">
                                    <Tag size={12} className="text-blue-600" />
                                    <span>Luxury</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                                        {resort.resortName}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-3">
                                        {resort.description || "Experience breathtaking views, elegant layouts, and world-class service. A perfect home away from home."}
                                    </p>
                                </div>

                                {/* Amenities list */}
                                {resort.amenities && resort.amenities.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        <div className="flex flex-wrap gap-1.5">
                                            {resort.amenities.slice(0, 4).map((amenity, idx) => (
                                                <span key={idx} className="bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    {amenity}
                                                </span>
                                            ))}
                                            {resort.amenities.length > 4 && (
                                                <span className="text-gray-400 text-xs px-1 py-1 font-medium">
                                                    +{resort.amenities.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Book Footer */}
                            <div className="px-6 pb-6 pt-2">
                                <Link href={`/resorts/${resort._id}`}>
                                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-600/10">
                                        <span>View Rooms</span>
                                        <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-slate-50">
                    <House className="mx-auto text-gray-400 stroke-1" size={48} />
                    <h4 className="text-lg font-semibold text-gray-700 mt-4">No Resorts Available</h4>
                    <p className="text-gray-500 text-sm mt-1">Please log in to the admin panel to publish new resorts.</p>
                </div>
            )
            }
        </section >
    );
}
