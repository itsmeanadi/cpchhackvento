import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllJobs } from "@/lib/jobs";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  // Unified Data Fetching
  const jobs = await getAllJobs();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={session.user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Placement Control Center</h1>
            <p className="text-gray-500">Manage companies, students, and notices.</p>
          </div>
          <Link
            href="/admin/notifications"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            🔔 Broadcast
          </Link>
          <Link
            href="/admin/schedule-interview"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            📅 Schedule Interview
          </Link>
          <Link
            href="/admin/post-job"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            + Post New Job
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-6">Recent Applications / Active Drives</h3>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.companyName}</div>
                        <div className="text-xs text-gray-500">{job.ctc}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/jobs/${job.id}/applications`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View Applicants
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {job.documentUrl && (
                          <a href={job.documentUrl} target="_blank" className="text-gray-500 hover:text-gray-900">View Doc</a>
                        )}
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No active drives. Post a job to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div >
  )
}