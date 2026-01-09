"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

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
        description: "", // Fallback or additional comments
    });

    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let documentUrl = "";

            // 1. Upload Document if exists
            if (file) {
                const storageRef = ref(storage, `job-docs/${Date.now()}-${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                documentUrl = await getDownloadURL(snapshot.ref);
            }

            // 2. Save to Firestore
            await addDoc(collection(db, "jobs"), {
                ...formData,
                skills: formData.skills.split(",").map(s => s.trim()), // storage as array
                documentUrl,
                createdAt: new Date(),
                status: "active"
            });

            setIsSuccess(true);

            // Reset form after 2 seconds or redirect
            setTimeout(() => {
                router.push("/admin");
            }, 2000);

        } catch (error) {
            console.error("Error posting job:", error);
            alert("Failed to post job. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-gray-100">
                    <div className="mb-6 flex justify-center">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted!</h2>
                    <p className="text-gray-500 mb-8">Successfully broadcasted {formData.companyName} opportunity to students.</p>
                    <button
                        onClick={() => router.push("/admin")}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Post New Opportunity</h1>
                                <p className="text-sm text-gray-500 mt-1">Create a new job listing for students.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    companyName: "Google",
                                    skills: "Data Structures, Algorithms, System Design",
                                    min10th: 90,
                                    min12th: 90,
                                    minCGPA: 8.5,
                                    gender: "Any",
                                    description: "Software Engineer Role",
                                })}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                            >
                                Demo Fill
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Company Details */}
                        <div className="space-y-6">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Company Details</h3>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                        placeholder="e.g. Google, Microsoft, TCS"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (Comma separated)</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                        placeholder="e.g. React, Node.js, Python, DSA"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Eligibility Criteria */}
                        <div className="space-y-6">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Eligibility Criteria</h3>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min 10th %</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                        value={formData.min10th}
                                        onChange={(e) => setFormData({ ...formData, min10th: Number(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min 12th %</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                        value={formData.min12th}
                                        onChange={(e) => setFormData({ ...formData, min12th: Number(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min CGPA</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                        value={formData.minCGPA}
                                        onChange={(e) => setFormData({ ...formData, minCGPA: Number(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender Allowed</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none bg-white"
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

                        {/* Document Upload */}
                        <div className="space-y-6">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Job Details Document</h3>

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".doc, .docx"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <div className="flex flex-col items-center">
                                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                                        <Upload size={24} className="text-gray-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {file ? file.name : "Click to upload perks/details PDF"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">txt, DOC up to 5MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                            >
                                {isLoading ? "Posting Job..." : "Publish Job Post"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
