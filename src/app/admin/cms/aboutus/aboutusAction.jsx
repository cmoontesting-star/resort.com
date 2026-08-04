"use client";

import { useRouter } from "next/navigation";

export default function AboutusActions({ aboutUsId, onDeleteSuccess }) {
    const router = useRouter();

    const handleEdit = () => {
        router.push("/admin/cms/aboutus/add");
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete About Us?")) return;
        try {
            const res = await fetch("/api/admin/aboutus", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert("About Us deleted successfully!");
                if (onDeleteSuccess) {
                    onDeleteSuccess(aboutUsId);
                }
            } else {
                alert(data.message || "Failed to delete About Us");
            }
        } catch (error) {
            console.error("Error deleting About Us:", error);
            alert("An error occurred while deleting About Us.");
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
