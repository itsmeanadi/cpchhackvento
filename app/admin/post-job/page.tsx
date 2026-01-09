"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";

export default function PostJobPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        companyName: "",
        skills: "",
        min10th: 60,
        min12th: 60,
        minCGPA: 7.0,
        gender: "Any",
        description: "",
    });

    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let documentUrl = "";

            if (file) {
                const storageRef = ref(storage, `job-docs/${Date.now()}-${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                documentUrl = await getDownloadURL(snapshot.ref);
            }

            await addDoc(collection(db, "jobs"), {
                ...formData,
                skills: formData.skills.split(",").map(s => s.trim()),
                documentUrl,
                createdAt: new Date(),
                status: "active"
            });

            setIsSuccess(true);
            setTimeout(() => {
                router.push("/admin");
            }, 2000);

        } catch (error) {
            console.error(error);
            alert("Failed to post job. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Job Posted Successfully</h2>
                    <p className="text-gray-500">Redirecting you to the dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">

            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Post New Opportunity</h1>
                    <p className="text-gray-500 text-sm mt-1">Create a new job listing for students.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1 */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Company Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Company Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
                                        placeholder="e.g. Google"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Required Skills</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
                                        placeholder="React, Node.js..."
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Section 2 */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Eligibility Criteria</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Min 10th %</label>
                                    <input
                                        required type="number"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all"
                                        value={formData.min10th}
                                        onChange={(e) => setFormData({ ...formData, min10th: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Min 12th %</label>
                                    <input
                                        required type="number"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all"
                                        value={formData.min12th}
                                        onChange={(e) => setFormData({ ...formData, min12th: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Min CGPA</label>
                                    <input
                                        required type="number" step="0.1"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all"
                                        value={formData.minCGPA}
                                        onChange={(e) => setFormData({ ...formData, minCGPA: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Gender</label>
                                    <select
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="Any">Any</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Section 3 */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Documents</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                <input
                                    type="file"
                                    accept=".doc,.docx,.pdf"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                                        <UploadCloud size={20} className="text-gray-500" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {file ? file.name : "Click to upload JD / Perks PDF"}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">PDF, DOC up to 5MB</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Publish Opportunity"}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}
