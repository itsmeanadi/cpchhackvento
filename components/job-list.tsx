"use client";

import { useState } from "react";
import { Job } from "@/lib/jobs";
import { ApplyButton } from "@/components/apply-button";
import { CheckCircle2, Search } from "lucide-react";

interface JobListProps {
    jobs: Job[];
    userSkills: string[];
    appliedJobIds?: string[];
    userData?: any;
}

export function JobList({ jobs, userSkills, appliedJobIds = [], userData }: JobListProps) {
    const [filter, setFilter] = useState<"all" | "eligible" | "applied" | "unapplied">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredJobs = jobs.filter((job) => {
        const isApplied = appliedJobIds.includes(job.id);
        const userCgpa = parseFloat(userData?.cgpa || "0");
        const jobCgpa = parseFloat(job.cgpa as string) || 0;
        const isEligible = userCgpa >= jobCgpa;

        const matchesSearch =
            job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === "applied") return isApplied;
        if (filter === "unapplied") return !isApplied;
        if (filter === "eligible") return isEligible && !isApplied;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Search Header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-white">Latest Opportunities</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search roles or companies..."
                        className="bg-neutral-900 border border-neutral-800 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-neutral-600 w-64 placeholder:text-neutral-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {(["all", "eligible", "applied", "unapplied"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                            : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                            } capitalize`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => {
                        const isMatch = userSkills.some((us) =>
                            job.skills?.some(
                                (js) =>
                                    js.toLowerCase().includes(us.toLowerCase()) ||
                                    us.toLowerCase().includes(js.toLowerCase())
                            )
                        );
                        const isApplied = appliedJobIds.includes(job.id);

                        return (
                            <div
                                key={job.id}
                                className={`group relative bg-neutral-900/30 border border-neutral-800 rounded-lg p-6 hover:bg-neutral-900/50 transition-all ${isMatch ? "ring-1 ring-indigo-500/20 bg-indigo-500/5" : ""
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-md bg-white flex items-center justify-center text-lg font-bold text-black border border-neutral-200">
                                            {job.companyName.charAt(0)}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg text-white">
                                                    {job.companyName}
                                                </h3>
                                                {isMatch && (
                                                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                                        Recommended
                                                    </span>
                                                )}
                                                {isApplied && (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                                                        <CheckCircle2 size={12} /> Applied
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-neutral-400 text-sm mt-0.5">{job.role}</p>

                                            <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
                                                <span className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-600"></div>
                                                    CGPA {job.cgpa}+
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-600"></div>
                                                    {job.ctc}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-600"></div>
                                                    Posted {job.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pl-16 md:pl-0">
                                        {/* If Applied, Show Status instead of Apply Button */}
                                        {isApplied ? (
                                            <button disabled className="px-4 py-2 bg-neutral-800 text-neutral-400 text-sm font-medium rounded-md cursor-not-allowed border border-neutral-700">
                                                Already Applied
                                            </button>
                                        ) : job.documentUrl ? (
                                            <a
                                                href={job.documentUrl}
                                                target="_blank"
                                                className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white border border-neutral-800 rounded-md hover:bg-neutral-800 transition-colors"
                                            >
                                                View Details
                                            </a>
                                        ) : (
                                            <ApplyButton jobId={job.id} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 border border-dashed border-neutral-800 rounded-lg">
                        <p className="text-neutral-500">No positions found matching this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
