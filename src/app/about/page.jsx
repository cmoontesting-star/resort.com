"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

const Aboutpage = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch("/api/admin/aboutus");
                const data = await response.json();
                if (response.ok && data.success && data.data && data.data.length > 0) {
                    setAboutData(data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching About Us data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    // Set fallback values
    const bannerImage = aboutData?.bannerImage || "/images/about-banner.jpg";
    const title = aboutData?.title || "Welcome to Dream Escapes";
    const description = aboutData?.description || "Dream Escapes is a premier travel platform dedicated to connecting travelers with unforgettable resort experiences worldwide. Founded with a passion for exploration and a commitment to excellence, we strive to make your vacation planning seamless, enjoyable, and inspiring.";

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Header />
            <div className="relative w-full h-[400px]">
                <img
                    src={bannerImage}
                    alt="About Us"
                    width={1000}
                    height={500}
                    className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-4xl md:text-6xl font-bold">About Us</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 p-6 md:p-12">
                <div className="w-full md:w-2/3">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 border-b-4 border-blue-600 pb-3 inline-block">
                        {title}
                    </h2>
                    <p className="text-gray-600 mt-6 leading-relaxed text-lg whitespace-pre-line">
                        {description}
                    </p>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                    {/* Visual embellishment */}
                    <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-gray-50/50 w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Our Mission</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            To inspire wanderlust and deliver seamless, premium access to the world's most spectacular destinations.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Aboutpage;