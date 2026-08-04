import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import DBConnection from "@/utils/config/db";
import Resort from "@/utils/models/Resort";
import Rooms from "@/utils/models/Room";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Link from "next/link";
import { ArrowLeft, Tag, CheckCircle, Wifi, Users, Award, ShieldAlert, Sparkles, Building2, Calendar } from "lucide-react";

export default async function ResortDetailsPage({ params }) {
    const { id } = await params;

    await DBConnection();

    const resortObj = await Resort.findById(id).lean();
    if (!resortObj) {
        return (
            <>
                <Header />
                <main className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center max-w-md shadow-sm">
                        <ShieldAlert className="mx-auto text-red-500 mb-4 stroke-1" size={56} />
                        <h2 className="text-2xl font-bold mb-2">Resort Not Found</h2>
                        <p className="text-red-600 mb-6">The resort you are looking for might have been removed or is temporarily unavailable.</p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md hover:shadow-red-600/10">
                            <ArrowLeft size={16} />
                            <span>Return to Home</span>
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const roomsObj = await Rooms.find({ resortId: id }).lean();

    // Serialize data to avoid Mongoose type serialization warnings (e.g. ObjectId, Date)
    const resort = {
        _id: resortObj._id.toString(),
        resortName: resortObj.resortName,
        description: resortObj.description || "",
        images: resortObj.images || [],
        amenities: resortObj.amenities || [],
        status: resortObj.status || "inactive",
    };

    const rooms = roomsObj.map(room => ({
        _id: room._id.toString(),
        resortId: room.resortId.toString(),
        roomName: room.roomName,
        roomType: room.roomType,
        price: room.price,
        capacity: room.capacity,
        totalRooms: room.totalRooms,
        availableRooms: room.availableRooms,
        roomImages: room.roomImages || [],
    }));

    // Helper to get room type styling badges
    const getRoomTypeBadge = (type) => {
        switch (type) {
            case "Suite":
                return "bg-indigo-50 text-indigo-700 border-indigo-100";
            case "Villa":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "Deluxe":
                return "bg-purple-50 text-purple-700 border-purple-100";
            case "Cottage":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            default:
                return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50">
            <Header />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium group text-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to all escapes</span>
                    </Link>
                </div>

                {/* Hero Section */}
                <section className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm mb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Images Collage */}
                        <div className="lg:col-span-7 relative h-[350px] sm:h-[450px] bg-slate-100">
                            {resort.images && resort.images.length > 0 ? (
                                <img
                                    src={resort.images[0]}
                                    alt={resort.resortName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <Building2 size={64} className="stroke-1 text-gray-300" />
                                    <span className="text-sm mt-3">No images uploaded for this resort</span>
                                </div>
                            )}
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1.5 shadow-md">
                                <Sparkles size={14} className="text-amber-500" />
                                <span>Featured Luxury</span>
                            </div>
                        </div>

                        {/* Resort Basic Info */}
                        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wider uppercase mb-3">
                                    <Tag size={12} />
                                    <span>Premium Retreat</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                    {resort.resortName}
                                </h1>
                                <div className="h-1 w-20 bg-blue-600 rounded-full mt-4 mb-6"></div>
                                <p className="text-gray-600 text-base leading-relaxed mb-6 whitespace-pre-line">
                                    {resort.description || "Experience breath-taking views, unparalleled luxury, and serene landscapes. Designed to be your ultimate sanctuary of relaxation and joy."}
                                </p>
                            </div>

                            {/* Key Features / Status Info */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">Verified Destination</h4>
                                        <p className="text-xs text-gray-500">100% Secure Bookings</p>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                    {resort.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Amenities & Description Details */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Amenities Card */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                                <Sparkles size={18} className="text-blue-600" />
                                <span>Exclusive Amenities</span>
                            </h3>
                            {resort.amenities && resort.amenities.length > 0 ? (
                                <ul className="space-y-3">
                                    {resort.amenities.map((amenity, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                                            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                                            <span className="font-medium text-gray-700">{amenity}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No amenities specified. Ask our desk for extra requests.</p>
                            )}
                        </div>

                        {/* Booking Policies or Helper info */}
                        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-24 h-24 bg-blue-600 rounded-full opacity-10 blur-xl"></div>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <Calendar size={18} className="text-blue-400" />
                                <span>Flexible Bookings</span>
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                Book instantly with peace of mind. Check individual room details for customizable check-in dates and occupancy sizes.
                            </p>
                            <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5 text-xs text-gray-400">
                                <div className="flex justify-between">
                                    <span>Check-in time:</span>
                                    <span className="font-medium text-white">10:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Check-out time:</span>
                                    <span className="font-medium text-white">11:00 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rooms List Section */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Available Accommodations</h2>
                                <p className="text-sm text-gray-500">Choose from our curated room selection for your stay.</p>
                            </div>
                            <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-xl font-semibold border border-blue-100">
                                {rooms.length} {rooms.length === 1 ? "Option" : "Options"}
                            </span>
                        </div>

                        {rooms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {rooms.map((room) => (
                                    <div key={room._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition duration-200 flex flex-col justify-between group">

                                        {/* Room Images Slider placeholder */}
                                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                                            {room.roomImages && room.roomImages.length > 0 ? (
                                                <img
                                                    src={room.roomImages[0]}
                                                    alt={room.roomName}
                                                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                    <Building2 size={36} className="stroke-1 text-gray-300" />
                                                    <span className="text-xs mt-2">No Room Image Available</span>
                                                </div>
                                            )}

                                            {/* Room Type badge */}
                                            <span className={`absolute top-4 left-4 border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getRoomTypeBadge(room.roomType)}`}>
                                                {room.roomType}
                                            </span>
                                        </div>

                                        {/* Room details */}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                                                    {room.roomName}
                                                </h3>

                                                {/* Specs */}
                                                <div className="grid grid-cols-2 gap-3 py-3 my-3 border-y border-gray-50 text-xs font-medium text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Users size={14} className="text-slate-400" />
                                                        <span>Max {room.capacity} Guests</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 justify-end">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                        <span>{room.availableRooms} of {room.totalRooms} Free</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price and CTA */}
                                            <div className="mt-4 flex items-center justify-between pt-2">
                                                <div>
                                                    <span className="text-xs text-gray-400 block font-medium">Nightly Rate</span>
                                                    <span className="text-xl font-extrabold text-gray-900">
                                                        ₹{room.price.toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                                <Link href={`/checkout?resortId=${resort._id}&roomId=${room._id}&price=${room.price}&roomName=${encodeURIComponent(room.roomName)}&resortName=${encodeURIComponent(resort.resortName)}`} className="bg-slate-900 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-600 transition duration-200 shadow-sm hover:shadow-md">
                                                    Book Stay
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-white">
                                <Building2 className="mx-auto text-gray-300 stroke-1" size={48} />
                                <h4 className="text-base font-semibold text-gray-700 mt-4">No Rooms Published Yet</h4>
                                <p className="text-gray-400 text-xs mt-1">This resort is currently not accepting stays. Check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
