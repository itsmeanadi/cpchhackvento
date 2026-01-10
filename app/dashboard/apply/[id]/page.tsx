import { auth } from "@/auth";
import { getJobById } from "@/lib/jobs";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ConfirmApplicationButton } from "./confirm-button";
import { ArrowLeft, Building2, MapPin, Clock, DollarSign, Users } from "lucide-react";

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { id } = await params;
    const job = await getJobById(id);

    if (!job) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-neutral-400 mb-2">Job listing not found</p>
                    <Link href="/dashboard" className="text-indigo-500 font-medium hover:text-indigo-400">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    // Deterministic stats
    const getDemoStats = (name: string) => {
        const chars = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return {
            lastVisit: 2023 + (chars % 2),
            avgPackage: 12 + (chars % 20),
            maxPackage: 25 + (chars % 30),
            hires: 3 + (chars % 12),
        };
    };

    const stats = getDemoStats(job.companyName);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            <Navbar user={session.user} />

            <main className="max-w-5xl mx-auto px-6 py-10">

                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN: Main Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Header */}
                        <div className="flex items-start gap-6">
                            <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-black border border-neutral-200 shadow-sm">
                                {job.companyName.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{job.role}</h1>
                                <div className="flex items-center gap-4 text-neutral-400 text-sm">
                                    <span className="flex items-center gap-1.5"><Building2 size={14} /> {job.companyName}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> Bangalore / Remote</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> Full Time</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-neutral-800" />

                        {/* Description Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold">About the Role</h2>
                            <p className="text-neutral-300 leading-relaxed text-sm">
                                We are looking for a talented {job.role} to join our team. You will be responsible for developing high-quality software solutions and working with cross-functional teams to deliver exceptional user experiences.
                            </p>

                            <h3 className="text-sm font-semibold text-white mt-6 mb-3">Key Requirements</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-400 text-sm">
                                <li>Strong proficiency in Data Structures and Algorithms.</li>
                                <li>Minimum CGPA of {job.cgpa} with no active backlogs.</li>
                                <li>Experience with modern frameworks (React/Node.js).</li>
                                <li>Excellent problem-solving skills.</li>
                            </ul>
                        </div>

                        {/* Historical Data (Clean Visuals) */}
                        <div className="bg-neutral-900/30 border border-neutral-800 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-neutral-400 mb-6 uppercase tracking-wide">Recruitment Insights</h3>

                            <div className="space-y-5">
                                {/* Hires */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white">Previous Hires</span>
                                        <span className="text-white font-medium">{stats.hires} Students</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(stats.hires / 15) * 100}%` }}></div>
                                    </div>
                                </div>
                                {/* Pkg */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white">Average Offer</span>
                                        <span className="text-white font-medium">{stats.avgPackage} LPA</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(stats.avgPackage / 40) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* RIGHT COLUMN: Action Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
                            <h3 className="text-white font-semibold mb-6">Job Overview</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-400">CTC Offered</span>
                                    <span className="text-white font-medium">{job.ctc}</span>
                                </div>
                                <div className="h-px bg-neutral-800/50" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-400">Min CGPA</span>
                                    <span className="text-white font-medium">{job.cgpa}</span>
                                </div>
                                <div className="h-px bg-neutral-800/50" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-400">Apply By</span>
                                    <span className="text-white font-medium">Tomorrow</span>
                                </div>
                            </div>

                            {job.documentUrl ? (
                                <a
                                    href={job.documentUrl}
                                    target="_blank"
                                    className="block w-full text-center py-3 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors text-white font-medium text-sm"
                                >
                                    Download JD
                                </a>
                            ) : (
                                <div className="space-y-3">
                                    <ConfirmApplicationButton jobId={id} />
                                    <p className="text-xs text-center text-neutral-500">
                                        Your currently saved resume will be sent.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
