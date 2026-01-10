import { auth } from "@/auth";
import { getUserApplications } from "@/lib/applications";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Clock, Briefcase, Calendar } from "lucide-react";

export default async function ApplicationsPage() {
    const session = await auth();

    if (!session?.user?.email) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-neutral-400 mb-2">Please log in to view your applications</p>
                    <Link href="/login" className="text-indigo-500 font-medium hover:text-indigo-400">Log In</Link>
                </div>
            </div>
        );
    }

    const applications = await getUserApplications(session.user.email);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
            <Navbar user={session.user} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
                </div>

                <div className="space-y-4">
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <div key={app.id} className="bg-neutral-900/30 border border-neutral-800 rounded-lg p-5 hover:bg-neutral-900/50 transition-colors group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-lg font-bold text-black border border-neutral-200">
                                            {app.companyName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white text-lg">{app.role}</h3>
                                            <div className="flex items-center gap-2 text-neutral-400 text-sm mt-1">
                                                <span className="flex items-center gap-1"><Building2 size={12} /> {app.companyName}</span>
                                                <span className="text-neutral-700">•</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </div>
                                        <Link
                                            href={`/dashboard/apply/${app.jobId}`}
                                            className="px-4 py-2 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors"
                                        >
                                            View Job
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-lg bg-neutral-900/20">
                            <div className="mx-auto h-12 w-12 text-neutral-600 mb-4">
                                <Briefcase size={48} strokeWidth={1} />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-1">No applications yet</h3>
                            <p className="text-neutral-500 mb-6">Start exploring opportunities and apply to your dream jobs.</p>
                            <Link
                                href="/dashboard"
                                className="inline-inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Browse Jobs
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function getStatusStyle(status: string) {
    switch (status) {
        case "Applied":
            return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "Under Review":
            return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        case "Interview Scheduled":
            return "bg-purple-500/10 text-purple-400 border-purple-500/20";
        case "Selected":
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "Rejected":
            return "bg-red-500/10 text-red-400 border-red-500/20";
        default:
            return "bg-neutral-800 text-neutral-400 border-neutral-700";
    }
}
