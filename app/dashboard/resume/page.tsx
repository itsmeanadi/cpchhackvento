"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, ArrowRight, Loader2, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ResumeAnalyzerPage() {
    const { data: session } = useSession();
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setError("");
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError("");
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/analyze-resume", {
                method: "POST",
                body: formData,
            });

            const responseText = await res.text();
            console.log("Raw Server Response:", responseText.slice(0, 500)); // Log first 500 chars

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError);
                throw new Error(`Server returned invalid response (Status ${res.status}): ${responseText.slice(0, 100)}...`);
            }

            if (!res.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            setResult(data.analysis);
        } catch (err: any) {
            console.error("Upload Error:", err);
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <Navbar user={session?.user || { name: "Student", role: "student" }} />

            <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-indigo-500/10 mb-4 ring-1 ring-indigo-500/30">
                        <Sparkles size={20} className="text-indigo-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                        AI Resume Doctor
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                        Upload your resume (PDF/DOCX) and let our Gemini-powered AI analyze it for ATS compatibility, content strength, and formatting improvements.
                    </p>
                </div>

                {/* Upload Section */}
                <div className="max-w-xl mx-auto mb-12">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center hover:border-neutral-700 transition-colors relative group">
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        <div className="pointer-events-none">
                            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-neutral-700 transition-colors">
                                {file ? <FileText size={32} className="text-indigo-400" /> : <Upload size={32} className="text-neutral-500" />}
                            </div>
                            {file ? (
                                <div>
                                    <p className="text-lg font-medium text-white">{file.name}</p>
                                    <p className="text-sm text-neutral-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-lg font-medium text-white">Drop your resume here</p>
                                    <p className="text-sm text-neutral-500 mt-1">Supports PDF, DOCX, TXT</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {file && !isAnalyzing && !result && (
                        <button
                            onClick={handleAnalyze}
                            className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Wand2 size={18} />
                            Analyze Resume
                        </button>
                    )}

                    {isAnalyzing && (
                        <button disabled className="w-full mt-4 bg-neutral-800 text-neutral-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                            <Loader2 size={18} className="animate-spin" />
                            Analyzing with Gemini...
                        </button>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                            <XCircle size={20} className="shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {result && (
                    <div className="animate-slide-up space-y-8">

                        {/* Score Card */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-800" />
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className={result.score > 75 ? "text-green-500" : result.score > 50 ? "text-amber-500" : "text-red-500"} strokeDasharray={351} strokeDashoffset={351 - (351 * result.score) / 100} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-4xl font-bold text-white">{result.score}</span>
                                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Score</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-white mb-1">ATS Compatibility</h3>
                                <p className="text-sm text-neutral-500">
                                    {result.score > 75 ? "Excellent! Ready for applications." : result.score > 50 ? "Good start, needs refinement." : "Needs significant improvement."}
                                </p>
                            </div>

                            <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                    <FileText size={18} className="text-indigo-400" />
                                    Professional Summary
                                </h3>
                                <p className="text-neutral-300 leading-relaxed bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50">
                                    {result.summary}
                                </p>
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-500" />
                                    Key Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {result.strengths.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-amber-500" />
                                    Areas for Improvement
                                </h3>
                                <ul className="space-y-3">
                                    {result.weaknesses.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-2xl p-8">
                            <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                                <Wand2 size={24} className="text-indigo-400" />
                                AI Recommended Fixes
                            </h3>
                            <div className="space-y-4">
                                {result.suggestions.map((suggestion: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-neutral-950/50 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </span>
                                        <p className="text-neutral-200 text-sm leading-relaxed pt-1.5">{suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <Link href="/dashboard" className="text-neutral-500 hover:text-white transition-colors text-sm">
                                &larr; Back to Dashboard
                            </Link>
                        </div>

                    </div>
                )}

            </main>
        </div>
    );
}
