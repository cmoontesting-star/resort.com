"use client";

import { useRouter } from "next/navigation";

export default function BannerActions({ bannerId, onDeleteSuccess }) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/admin/banners/edit/${bannerId}`);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        try {
            const res = await fetch(`/api/banners/${bannerId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            if (res.ok) {
                alert("Banner deleted successfully!");
                if (onDeleteSuccess) {
                    onDeleteSuccess(bannerId);
                }
            } else {
                alert(data.message || "Failed to delete banner");
            }
        } catch (error) {
            console.error("Error deleting banner:", error);
            alert("An error occurred while deleting the banner.");
        }
    };

    return (
        <div className="flex gap-3 justify-end">
            <button
                className="text-blue-600 hover:text-blue-900 transition cursor-pointer font-medium"
                onClick={handleEdit}
            >
                Edit
            </button>

            <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900 transition cursor-pointer font-medium"
            >
                Delete
            </button>
        </div>
    );
}