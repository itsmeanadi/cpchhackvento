import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { getAllJobs } from "@/lib/jobs";
import { Navbar } from "@/components/navbar";
import { Briefcase, Calendar, CheckCircle, AlertTriangle, ArrowRight, Download } from "lucide-react";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    return null;
  }

  // Unified Data Fetching
  const jobs = await getAllJobs();

  // Determine if Guest
  const isGuest = session.user.email === "guest_student@example.com";

  let userData;

  if (isGuest) {
    userData = {
      name: "Guest Student",
      isProfileComplete: true,
      branch: "Computer Science",
      cgpa: 8.5,
    };
  } else {
    const adminDb = getAdminDb();
    const userRef = adminDb.collection("users").doc(session.user.email!);
    const userSnap = await userRef.get();
    userData = userSnap.data();
  }

  const isProfileComplete = userData?.isProfileComplete;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <Navbar user={session.user} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header Section - Simplified */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
              Welcome back, {userData?.name?.split(' ')[0]}
            </h1>
            <p className="text-neutral-400">
              Here's what's happening today in your placement journey.
            </p>
          </div>

          {!isProfileComplete && (
            <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-4 flex items-start gap-3 max-w-md">
              <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-500">Complete Profile</p>
                <p className="text-sm text-amber-500/80 mt-1">
                  Please <a href="/profile/edit" className="underline hover:text-amber-400">update your academic details</a> to apply for jobs.
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Stats Grid - Cleaner, Solid Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {[
            {
              label: "Applications",
              value: "3",
              icon: Briefcase,
              color: "text-neutral-400"
            },
            {
              label: "Interviews",
              value: "1",
              icon: Calendar,
              color: "text-neutral-400"
            },
            {
              label: "Profile",
              value: isProfileComplete ? "Ready" : "Incomplete",
              icon: isProfileComplete ? CheckCircle : AlertTriangle,
              color: isProfileComplete ? "text-emerald-500" : "text-amber-500"
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 transition-all hover:bg-neutral-900/80"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Job Listings - Modern List View */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Open Opportunities</h3>
            <button className="text-sm text-neutral-400 hover:text-white transition-colors">
              View All &rarr;
            </button>
          </div>

          <div className="space-y-4">

            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="group bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                >
                  {/* Icon Placeholder or Company Logo */}
                  <div className="h-12 w-12 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 font-bold text-lg text-neutral-400">
                    {job.companyName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-medium text-white truncate">{job.companyName}</h4>
                      {/* Status Chip */}
                      <span className="text-[10px] font-medium bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase tracking-wide">
                        Active
                      </span>
                    </div>
                    <p className="text-neutral-400 text-sm mt-1">{job.role}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-neutral-500 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                        Min CGPA: {job.cgpa}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                        CTC: {job.ctc}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                        Date: {job.date}
                      </span>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    {job.documentUrl ? (
                      <a
                        href={job.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-neutral-100 text-black text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
                      >
                        <Download size={14} />
                        Details
                      </a>
                    ) : (
                      <button className="px-5 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors">
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
                <p className="text-neutral-500">No active job posts found.</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}