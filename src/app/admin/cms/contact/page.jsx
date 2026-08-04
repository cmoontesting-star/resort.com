"use client"
import { useState, useEffect } from "react";

export default function ContactList() {

    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch("/api/conatct");
            const result = await response.json();

            if (result.contacts) {
                setContacts(result.contacts);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 text-center justify-center">

            <h1 className="text-2xl font-bold text-gray-800">Contact Page</h1>

            <table className="w-full border border-gray-400">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2">Name</th>
                        <th className="border border-gray-400 p-2">Phone</th>
                        <th className="border border-gray-400 p-2">Email</th>
                        <th className="border border-gray-400 p-2">Subject</th>
                        <th className="border border-gray-400 p-2">Message</th>
                        <th className="border border-gray-400 p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="border border-gray-400 p-4 text-gray-500">
                                No contacts found.
                            </td>
                        </tr>
                    ) : (
                        contacts.map((contact) => (
                            <tr key={contact._id}>
                                <td className="border border-gray-400 p-2">{contact.name}</td>
                                <td className="border border-gray-400 p-2">{contact.phone}</td>
                                <td className="border border-gray-400 p-2">{contact.email}</td>
                                <td className="border border-gray-400 p-2">{contact.subject}</td>
                                <td className="border border-gray-400 p-2">{contact.message}</td>
                                <td className="border border-gray-400 p-2 flex gap-2 justify-center">
                                    <button className="text-blue-600 hover:text-blue-800">View</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
