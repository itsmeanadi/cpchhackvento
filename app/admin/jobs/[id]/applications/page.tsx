import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { getJobApplications } from "@/lib/applications";
import { getJobById } from "@/lib/jobs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApplicationStatusDropdown } from "./status-dropdown";

export default async function AdminJobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
        redirect("/login");
    }

    const { id } = await params;
    const job = await getJobById(id);
    const applications = await getJobApplications(id);

    if (!job) {
        return <div>Job not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={session.user} />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin" className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{job.role} - {job.companyName}</h1>
                        <p className="text-gray-500">Total Applicants: {applications.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{app.userId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <ApplicationStatusDropdown
                                            applicationId={app.id}
                                            currentStatus={app.status}
                                            jobId={job.id}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No applications received yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    let colorClass = "bg-gray-100 text-gray-800";
    if (status === "Applied") colorClass = "bg-blue-100 text-blue-800";
    if (status === "Under Review") colorClass = "bg-amber-100 text-amber-800";
    if (status === "Interview Scheduled") colorClass = "bg-purple-100 text-purple-800";
    if (status === "Selected") colorClass = "bg-emerald-100 text-emerald-800";
    if (status === "Rejected") colorClass = "bg-red-100 text-red-800";

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {status}
        </span>
    );
}
