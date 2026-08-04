"use client";

import { useRouter } from "next/navigation";

export default function SubAdminActions({ email }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this sub-admin?")) return;

        try {
            const response = await fetch(`/api/admin/create-subadmin/${email}`, {
                method: "DELETE",
            });
            if (response.ok) {
                router.refresh(); // Refresh data without reloading the whole page
            } else {
                const error = await response.json();
                alert(error.message || "Failed to delete sub-admin");
            }
        } catch (error) {
            console.error("Error deleting sub-admin:", error);
            alert("Error deleting sub-admin");
        }
    };

    const handleEdit = () => {
        router.push(`/admin/subadmins/edit/${email}`);
    };

    return (
        <>
            <button className="text-blue-600 hover:text-blue-700 mr-4" onClick={handleEdit}>Edit</button>
            <button className="text-red-600 hover:text-red-700" onClick={handleDelete}>Delete</button>
        </>
    );
}
