"use client";

import { useRouter } from "next/navigation";

export default function RoomActions({ roomId }) {
    const router = useRouter();

    const handleEdit = () => {
        router.push("/admin/room/edit/" + roomId);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this room?")) return;
        const res = await fetch("/api/admin/rooms/" + roomId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        if (res.ok) {
            alert("Room deleted successfully!");
            router.refresh();
        } else {
            alert(data.message || "Failed to delete room");
        }
    };

    return (
        <>
            <button className="text-blue-600 hover:text-blue-700 mr-4" onClick={handleEdit}>Edit</button>
            <button className="text-red-600 hover:text-red-700" onClick={handleDelete}>Delete</button>
        </>
    );
}
