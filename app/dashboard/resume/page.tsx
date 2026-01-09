"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { useSession } from "next-auth/react";
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

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

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            setResult(data.analysis);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Circular Progress Component
    const ScoreCircle = ({ score }: { score: number }) => {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;

        let color = "text-red-500";
        if (score > 50) color = "text-amber-500";
        if (score > 75) color = "text-emerald-500";

        return (
            <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="transform -rotate-90 w-full h-full">
                    <circle className="text-neutral-800" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="64" cy="64" />
                    <circle
                        className={`${color} transition-all duration-1000 ease-out`}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="64"
                        cy="64"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">{score}</span>
                    <span className="text-xs text-neutral-500 uppercase">Score</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            <Navbar user={session?.user || { name: "Student", role: "student" }} />

            <main className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-semibold mb-3">AI Resume Review</h1>
                    <p className="text-neutral-400 max-w-xl mx-auto">
                        Optimize your resume for ATS algorithms and get actionable feedback to improve your hiring chances.
                    </p>
                </div>

                {/* Upload Section */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 mb-10 transition-all hover:border-neutral-700">
                    <div className="border-2 border-dashed border-neutral-700 rounded-lg p-10 text-center relative hover:bg-neutral-800/50 transition-colors">
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center pointer-events-none">
                            <div className="h-12 w-12 bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                                {file ? <FileText size={24} /> : <Upload size={24} />}
                            </div>
                            <h3 className="text-lg font-medium text-white mb-1">
                                {file ? file.name : "Upload your resume"}
                            </h3>
                            <p className="text-sm text-neutral-500">
                                {file ? "Ready to analyze" : "Drag and drop or click to browse (PDF, DOCX)"}
                            </p>
                        </div>
                    </div>

                    {file && !isAnalyzing && !result && (
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleAnalyze}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                            >
                                Start Analysis
                            </button>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="mt-8 text-center">
                            <Loader2 size={24} className="animate-spin mx-auto text-indigo-500 mb-2" />
                            <p className="text-sm text-neutral-400">Analyzing content structure and keywords...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400 justify-center">
                            <XCircle size={18} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {result && (
                    <div className="space-y-8 animate-fade-in">

                        {/* Summary Card */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-1 bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center">
                                <ScoreCircle score={result.score} />
                                <div className="mt-4 text-center">
                                    <p className="font-medium text-white">ATS Compatibility</p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {result.score > 70 ? "Ready for submission" : "Needs Improvement"}
                                    </p>
                                </div>
                            </div>

                            <div className="col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                                <h3 className="font-medium text-white mb-4">Professional Overview</h3>
                                <p className="text-sm text-neutral-300 leading-relaxed">
                                    {result.summary}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                                <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-emerald-500" /> Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {result.strengths.map((s: string, i: number) => (
                                        <li key={i} className="text-sm text-neutral-300 flex items-start gap-3">
                                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                                <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-amber-500" /> Improvements
                                </h3>
                                <ul className="space-y-3">
                                    {result.weaknesses.map((w: string, i: number) => (
                                        <li key={i} className="text-sm text-neutral-300 flex items-start gap-3">
                                            <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                                            {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="bg-indigo-900/10 border border-indigo-500/10 rounded-xl p-6">
                            <h3 className="font-medium text-white mb-4">Recommended Actions</h3>
                            <div className="space-y-3">
                                {result.suggestions.map((s: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-3 bg-neutral-900/50 rounded-lg">
                                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-neutral-300 pt-0.5">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

            </main>
        </div>
    );
}
