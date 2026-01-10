"use client";

import { Job } from "@/lib/jobs";
import { ApplyButton } from "@/components/apply-button";

interface JobListProps {
    jobs: Job[];
    userSkills: string[];
}

export function JobList({ jobs, userSkills }: JobListProps) {
    if (jobs.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed border-neutral-800 rounded-lg">
                <p className="text-neutral-500">No active positions available at this moment.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => {
                const isMatch = userSkills.some((us) =>
                    job.skills?.some(
                        (js) =>
                            js.toLowerCase().includes(us.toLowerCase()) ||
                            us.toLowerCase().includes(js.toLowerCase())
                    )
                );

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
                                {job.documentUrl ? (
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
            })}
        </div>
    );
}
