"use client";

import { useState, useEffect } from "react";
import { Gavel, Save, CheckCircle, RefreshCw } from "lucide-react";

export default function CMSTerms() {
    const [title, setTitle] = useState("Terms & Conditions");
    const [content, setContent] = useState(
        "1. Agreement to Terms\nBy accessing our resort and using our website, you agree to follow these Terms & Conditions...\n\n2. Reservation Policies\nCustomers must provide a valid ID upon check-in. Cancellations made 24 hours prior are free...\n\n3. Liability Limit\nResort.com is not liable for items lost during guest stays."
    );
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedTerms = localStorage.getItem("cms_terms");
        if (storedTerms) {
            try {
                const parsed = JSON.parse(storedTerms);
                setTitle(parsed.title || "Terms & Conditions");
                setContent(parsed.content || "");
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setSaving(true);
        const data = { title, content };
        localStorage.setItem("cms_terms", JSON.stringify(data));
        
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 800);
    };

    return (
        <div className="max-w-4xl space-y-8 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Gavel className="text-blue-600" size={32} />
                        CMS: Terms & Conditions Page Editor
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Edit and update terms of service and reservation conditions for your customers.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
                {saved && (
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-4 rounded-lg border border-emerald-200 text-sm font-medium">
                        <CheckCircle size={18} />
                        Changes saved successfully!
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Terms Content</label>
                        <textarea
                            rows={12}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono whitespace-pre-wrap"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition duration-150 text-sm cursor-pointer disabled:bg-blue-400"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="animate-spin" size={16} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
